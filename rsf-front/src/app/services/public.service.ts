import { ApplicationRef, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, MonoTypeOperatorFunction, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private apiUrl = `${environment.apiUrl}/public`;
  private tickScheduled = false;
  private readonly navIconFallbacks: Record<string, string> = {
    '/': 'fas fa-home',
    '/qui-sommes-nous': 'fas fa-book-open',
    '/organisation': 'fas fa-users',
    '/nos-missions': 'fas fa-bullseye',
    '/actions-solidaires': 'fas fa-handshake-angle',
    '/soutien-aux-membres': 'fas fa-heart',
    '/actions-internationales': 'fas fa-globe',
    '/evenements': 'fas fa-calendar-alt',
    '/temoignages': 'fas fa-comments',
    '/nous-rejoindre': 'fas fa-hands-holding',
    '/actualites': 'fas fa-newspaper',
    '/contact': 'fas fa-envelope',
    '/don': 'fas fa-heart',
  };
  private readonly truncatedIconAliases: Record<string, string> = {
    'fas fa-hom': 'fas fa-home',
    'fas fa-hou': 'fas fa-house',
    'fas fa-boo': 'fas fa-book-open',
    'fas fa-use': 'fas fa-users',
    'fas fa-bul': 'fas fa-bullseye',
    'fas fa-han': 'fas fa-handshake-angle',
    'fas fa-hea': 'fas fa-heart',
    'fas fa-glo': 'fas fa-globe',
    'fas fa-cal': 'fas fa-calendar-alt',
    'fas fa-com': 'fas fa-comments',
    'fas fa-new': 'fas fa-newspaper',
    'fas fa-env': 'fas fa-envelope',
  };

  constructor(
    private http: HttpClient,
    private appRef: ApplicationRef
  ) {}

  private normalizeLink(href: unknown): string {
    if (typeof href !== 'string') {
      return '';
    }

    const trimmed = href.trim();
    if (!trimmed) {
      return '';
    }

    if (/^(https?:|mailto:|tel:|#)/i.test(trimmed)) {
      return trimmed;
    }

    let normalized = trimmed.replace(/\\/g, '/');
    normalized = normalized.replace(/index\.html$/i, '');
    normalized = normalized.replace(/\.html$/i, '');
    normalized = normalized.replace(/\/+$/, '');

    if (!normalized || normalized === 'accueil' || normalized === '/accueil') {
      return '/';
    }

    return normalized.startsWith('/') ? normalized : `/${normalized}`;
  }

  private normalizeHrefField<T extends Record<string, any>>(item: T, fieldKey: 'href' | 'link_href'): T {
    if (!item || typeof item !== 'object') {
      return item;
    }

    return {
      ...item,
      [fieldKey]: this.normalizeLink(item[fieldKey]),
    };
  }

  private normalizeIconField(icon: unknown, href?: string): string {
    const value = typeof icon === 'string' ? icon.trim() : '';
    const fallback = href ? this.navIconFallbacks[href] : '';

    if (!value) {
      return fallback || '';
    }

    if (this.truncatedIconAliases[value]) {
      return this.truncatedIconAliases[value];
    }

    const hasFontAwesomePrefix = /\b(fas|far|fab|fa-solid|fa-regular|fa-brands)\b/.test(value);
    return hasFontAwesomePrefix && value.includes('fa-') ? value : fallback || value;
  }

  getPageContent(pageKey: string): Observable<any> {
    return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/pages/${pageKey}`).pipe(
      map((res) => res?.data ?? null),
      catchError(() => of(null)),
      this.refreshViewAfterResponse()
    );
  }

  getTeam(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/team`).pipe(
      map((res) => Array.isArray(res?.data) ? res.data : []),
      catchError(() => of([])),
      this.refreshViewAfterResponse()
    );
  }

  getMissions(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/missions`).pipe(
      map((res) => Array.isArray(res?.data) ? res.data : []),
      catchError(() => of([])),
      this.refreshViewAfterResponse()
    );
  }

  getActions(pageType?: string): Observable<any[]> {
    let params = new HttpParams();
    if (pageType) {
      params = params.set('page_type', pageType);
    }

    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/actions`, { params }).pipe(
      map((res) => Array.isArray(res?.data) ? res.data : []),
      catchError(() => of([])),
      this.refreshViewAfterResponse()
    );
  }

  getActionsSolidaires(): Observable<any[]> {
    return this.getActions('solidaire');
  }

  getTestimonials(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/testimonials`).pipe(
      map((res) => Array.isArray(res?.data) ? res.data : []),
      catchError(() => of([])),
      this.refreshViewAfterResponse()
    );
  }

  getEvents(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/events`).pipe(
      map((res) =>
        Array.isArray(res?.data)
          ? res.data.map((event) => this.normalizeHrefField(event, 'link_href'))
          : []
      ),
      catchError(() => of([])),
      this.refreshViewAfterResponse()
    );
  }

  getActualities(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/actualities`).pipe(
      map((res) =>
        Array.isArray(res?.data)
          ? res.data.map((actuality) => this.normalizeHrefField(actuality, 'link_href'))
          : []
      ),
      catchError(() => of([])),
      this.refreshViewAfterResponse()
    );
  }

  getDonModes(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/don-modes`).pipe(
      map((res) =>
        Array.isArray(res?.data)
          ? res.data.map((mode) => this.normalizeHrefField(mode, 'link_href'))
          : []
      ),
      catchError(() => of([])),
      this.refreshViewAfterResponse()
    );
  }

  getSettings(): Observable<any> {
    return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/settings`).pipe(
      map((res) => res?.data ?? null),
      catchError(() => of(null)),
      this.refreshViewAfterResponse()
    );
  }

  getNav(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/nav`).pipe(
      map((res) =>
        Array.isArray(res?.data)
          ? res.data.map((item) => {
              const normalized = this.normalizeHrefField(item, 'href');
              return {
                ...normalized,
                icon: this.normalizeIconField(normalized.icon, normalized.href),
              };
            })
          : []
      ),
      catchError(() => of([])),
      this.refreshViewAfterResponse()
    );
  }

  sendContactMessage(messageData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/contact`, messageData).pipe(this.refreshViewAfterResponse());
  }

  sendJoinRequest(requestData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/join-requests`, requestData).pipe(this.refreshViewAfterResponse());
  }

  private refreshViewAfterResponse<T>(): MonoTypeOperatorFunction<T> {
    return tap({
      next: () => this.scheduleViewRefresh(),
      error: () => this.scheduleViewRefresh(),
    });
  }

  private scheduleViewRefresh() {
    if (this.tickScheduled) return;

    this.tickScheduled = true;
    setTimeout(() => {
      this.tickScheduled = false;
      this.appRef.components.forEach((component) => {
        component.changeDetectorRef.detectChanges();
      });
    });
  }
}
