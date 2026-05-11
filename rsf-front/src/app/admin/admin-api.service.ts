import { ApplicationRef, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, MonoTypeOperatorFunction, tap } from 'rxjs';
import { environment } from '../../environments/environment';

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  raw?: unknown[];
  total?: number;
};

type UploadedImage = {
  image_url: string;
  filename?: string;
};

@Injectable({
  providedIn: 'root',
})
export class AdminApiService {
  private readonly apiUrl = environment.apiUrl;
  private tickScheduled = false;

  constructor(
    private readonly http: HttpClient,
    private readonly appRef: ApplicationRef
  ) {}

  getPage(pageKey: string) {
    return this.http.get<ApiResponse<Record<string, unknown>>>(`${this.apiUrl}/pages/${pageKey}`).pipe(
      map((response) => response?.data ?? {}),
      this.refreshViewAfterResponse(),
    );
  }

  updatePage(pageKey: string, fields: Record<string, unknown>) {
    return this.http
      .put<ApiResponse<unknown>>(`${this.apiUrl}/pages/${pageKey}`, { fields })
      .pipe(this.refreshViewAfterResponse());
  }

  listResource<T = Record<string, unknown>>(resource: string, query: Record<string, unknown> = {}) {
    const params = Object.entries(query).reduce((httpParams, [key, value]) => {
      if (value === undefined || value === null || value === '') {
        return httpParams;
      }

      return httpParams.set(key, String(value));
    }, new HttpParams());

    return this.http.get<ApiResponse<T[]>>(`${this.apiUrl}/${resource}`, { params }).pipe(
      map((response) => (Array.isArray(response?.data) ? response.data : [])),
      this.refreshViewAfterResponse(),
    );
  }

  createResource<T = Record<string, unknown>>(resource: string, payload: Record<string, unknown>) {
    return this.http.post<ApiResponse<T>>(`${this.apiUrl}/${resource}`, payload).pipe(
      map((response) => response?.data as T),
      this.refreshViewAfterResponse(),
    );
  }

  updateResource<T = Record<string, unknown>>(resource: string, id: string | number, payload: Record<string, unknown>) {
    return this.http.put<ApiResponse<T>>(`${this.apiUrl}/${resource}/${id}`, payload).pipe(
      map((response) => response?.data as T),
      this.refreshViewAfterResponse(),
    );
  }

  uploadEventPhoto(payload: { fileName: string; mimeType: string; dataUrl: string }) {
    return this.http.post<ApiResponse<UploadedImage>>(`${this.apiUrl}/events/photos/upload`, payload).pipe(
      map((response) => response?.data ?? { image_url: '' }),
      this.refreshViewAfterResponse(),
    );
  }

  uploadTeamPhoto(payload: { fileName: string; mimeType: string; dataUrl: string }) {
    return this.http.post<ApiResponse<UploadedImage>>(`${this.apiUrl}/team/photos/upload`, payload).pipe(
      map((response) => response?.data ?? { image_url: '' }),
      this.refreshViewAfterResponse(),
    );
  }

  deleteResource(resource: string, id: string | number) {
    return this.http
      .delete<ApiResponse<unknown>>(`${this.apiUrl}/${resource}/${id}`)
      .pipe(this.refreshViewAfterResponse());
  }

  reorderResource(resource: string, order: Array<{ id: number | string; sort_order: number }>) {
    return this.http
      .put<ApiResponse<unknown>>(`${this.apiUrl}/${resource}/reorder`, { order })
      .pipe(this.refreshViewAfterResponse());
  }

  getSettings() {
    return this.http.get<ApiResponse<Record<string, unknown>>>(`${this.apiUrl}/settings`).pipe(
      map((response) => ({
        data: response?.data ?? {},
        raw: Array.isArray(response?.raw) ? response.raw : [],
      })),
      this.refreshViewAfterResponse(),
    );
  }

  updateSettings(payload: Record<string, unknown>) {
    return this.http.put<ApiResponse<unknown>>(`${this.apiUrl}/settings`, payload).pipe(this.refreshViewAfterResponse());
  }

  getDashboardStats<T = Record<string, unknown>>() {
    return this.http.get<ApiResponse<T>>(`${this.apiUrl}/dashboard/stats`).pipe(
      map((response) => response?.data as T),
      this.refreshViewAfterResponse(),
    );
  }

  getContactMessages() {
    return this.http.get<ApiResponse<Record<string, unknown>[]>>(`${this.apiUrl}/contact/messages`).pipe(
      map((response) => (Array.isArray(response?.data) ? response.data : [])),
      this.refreshViewAfterResponse(),
    );
  }

  markContactMessageAsRead(id: number | string) {
    return this.http
      .patch<ApiResponse<unknown>>(`${this.apiUrl}/contact/messages/${id}/read`, {})
      .pipe(this.refreshViewAfterResponse());
  }

  deleteContactMessage(id: number | string) {
    return this.http
      .delete<ApiResponse<unknown>>(`${this.apiUrl}/contact/messages/${id}`)
      .pipe(this.refreshViewAfterResponse());
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
