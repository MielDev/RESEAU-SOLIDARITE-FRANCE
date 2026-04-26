import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type AdminSession = {
  token: string;
  user: AdminUser;
};

type AuthResponse = {
  success: boolean;
  message?: string;
  data?: AdminSession;
};

const STORAGE_KEY = 'rsf-admin-session';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly sessionState = signal<AdminSession | null>(this.readStoredSession());

  readonly session = computed(() => this.sessionState());
  readonly user = computed(() => this.sessionState()?.user ?? null);

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<AdminSession> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      map((response) => {
        if (!response?.data?.token || !response.data.user) {
          throw new Error('La reponse du serveur est incomplete.');
        }

        return response.data;
      }),
      tap((session) => this.storeSession(session)),
    );
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.post<{ success: boolean; message?: string }>(`${this.apiUrl}/change-password`, {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  logout() {
    this.sessionState.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  isAuthenticated() {
    return Boolean(this.sessionState()?.token);
  }

  getToken() {
    return this.sessionState()?.token ?? null;
  }

  getUserInitials() {
    const name = this.user()?.name?.trim();
    if (!name) {
      return 'AD';
    }

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }

  private storeSession(session: AdminSession) {
    this.sessionState.set(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  private readStoredSession(): AdminSession | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as AdminSession;
      if (!parsed?.token || !parsed?.user) {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }
}
