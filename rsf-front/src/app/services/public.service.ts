import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private apiUrl = `${environment.apiUrl}/public`;

  constructor(private http: HttpClient) {}

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

  getPageContent(pageKey: string): Observable<any> {
    return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/pages/${pageKey}`).pipe(
      map((res) => res?.data ?? null),
      catchError(() => of(null))
    );
  }

  getTeam(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/team`).pipe(
      map((res) => Array.isArray(res?.data) ? res.data : []),
      catchError(() => of([]))
    );
  }

  getMissions(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/missions`).pipe(
      map((res) => Array.isArray(res?.data) ? res.data : []),
      catchError(() => of([]))
    );
  }

  getActions(pageType?: string): Observable<any[]> {
    let params = new HttpParams();
    if (pageType) {
      params = params.set('page_type', pageType);
    }

    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/actions`, { params }).pipe(
      map((res) => Array.isArray(res?.data) ? res.data : []),
      catchError(() => of([]))
    );
  }

  getActionsSolidaires(): Observable<any[]> {
    return this.getActions('solidaire');
  }

  getTestimonials(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/testimonials`).pipe(
      map((res) => Array.isArray(res?.data) ? res.data : []),
      catchError(() => of([]))
    );
  }

  getEvents(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/events`).pipe(
      map((res) =>
        Array.isArray(res?.data)
          ? res.data.map((event) => this.normalizeHrefField(event, 'link_href'))
          : []
      ),
      catchError(() => of([]))
    );
  }

  getActualities(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/actualities`).pipe(
      map((res) =>
        Array.isArray(res?.data)
          ? res.data.map((actuality) => this.normalizeHrefField(actuality, 'link_href'))
          : []
      ),
      catchError(() => of([]))
    );
  }

  getDonModes(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/don-modes`).pipe(
      map((res) =>
        Array.isArray(res?.data)
          ? res.data.map((mode) => this.normalizeHrefField(mode, 'link_href'))
          : []
      ),
      catchError(() => of([]))
    );
  }

  getSettings(): Observable<any> {
    return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/settings`).pipe(
      map((res) => res?.data ?? null),
      catchError(() => of(null))
    );
  }

  getNav(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/nav`).pipe(
      map((res) =>
        Array.isArray(res?.data)
          ? res.data.map((item) => this.normalizeHrefField(item, 'href'))
          : []
      ),
      catchError(() => of([]))
    );
  }

  sendContactMessage(messageData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/contact`, messageData);
  }
}
