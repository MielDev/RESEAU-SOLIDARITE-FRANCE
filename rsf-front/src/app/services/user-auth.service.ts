import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export type UserSession = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type UserRegistrationData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  nationality: string;
  status: string;
};

type UserAccount = UserSession & {
  birthDate: string;
  nationality: string;
  status: string;
  passwordHash: string;
  createdAt: string;
};

type PasswordResetRequest = {
  email: string;
  token: string;
  expiresAt: string;
};

type HelpAuthResponse = {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: UserSession;
  };
};

type PasswordResetResponse = {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    expiresAt: string;
  };
};

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private readonly apiUrl = `${environment.apiUrl}/help-auth`;
  private readonly sessionKey = 'rsf-help-session';
  private readonly tokenKey = 'rsf-help-token';

  readonly currentUser = signal<UserSession | null>(this.loadSession());

  constructor(private readonly http: HttpClient) {}

  async register(data: UserRegistrationData): Promise<UserSession> {
    const response = await firstValueFrom(this.http.post<HelpAuthResponse>(`${this.apiUrl}/register`, data));
    return this.storeAuthResponse(response);
  }

  async login(emailValue: string, password: string): Promise<UserSession> {
    const response = await firstValueFrom(this.http.post<HelpAuthResponse>(`${this.apiUrl}/login`, {
      email: emailValue,
      password,
    }));

    return this.storeAuthResponse(response);
  }

  logout() {
    this.removeItem(this.sessionKey);
    this.removeItem(this.tokenKey);
    this.currentUser.set(null);
  }

  async requestPasswordReset(emailValue: string): Promise<{ token: string; expiresAt: string }> {
    const response = await firstValueFrom(this.http.post<PasswordResetResponse>(`${this.apiUrl}/password-reset/request`, {
      email: emailValue,
    }));

    if (!response?.data?.token || !response.data.expiresAt) {
      throw new Error(response?.message || 'Demande impossible pour le moment.');
    }

    return response.data;
  }

  async resetPassword(emailValue: string, token: string, password: string): Promise<void> {
    await firstValueFrom(this.http.post(`${this.apiUrl}/password-reset/confirm`, {
      email: emailValue,
      token,
      password,
    }));
  }

  getToken(): string | null {
    return this.getItem(this.tokenKey);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  private storeAuthResponse(response: HelpAuthResponse): UserSession {
    if (!response?.data?.token || !response.data.user) {
      throw new Error(response?.message || 'La reponse du serveur est incomplete.');
    }

    this.setItem(this.tokenKey, response.data.token);
    this.setItem(this.sessionKey, JSON.stringify(response.data.user));
    this.currentUser.set(response.data.user);
    return response.data.user;
  }

  private loadSession(): UserSession | null {
    return this.parseJson<UserSession | null>(this.getItem(this.sessionKey), null);
  }

  private getItem(key: string): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem(key);
  }

  private setItem(key: string, value: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  private removeItem(key: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  }

  private parseJson<T>(raw: string | null, fallback: T): T {
    if (!raw) {
      return fallback;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }
}
