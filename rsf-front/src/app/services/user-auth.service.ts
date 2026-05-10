import { Injectable, signal } from '@angular/core';

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
  school: string;
  program: string;
};

type UserAccount = UserSession & {
  birthDate: string;
  nationality: string;
  school: string;
  program: string;
  passwordHash: string;
  createdAt: string;
};

type PasswordResetRequest = {
  email: string;
  token: string;
  expiresAt: string;
};

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  readonly currentUser = signal<UserSession | null>(this.loadSession());

  private readonly usersKey = 'rsf-help-users';
  private readonly sessionKey = 'rsf-help-session';
  private readonly resetsKey = 'rsf-help-password-resets';

  async register(data: UserRegistrationData): Promise<UserSession> {
    const users = this.loadUsers();
    const email = this.normalizeEmail(data.email);

    if (users.some((user) => this.normalizeEmail(user.email) === email)) {
      throw new Error('Un compte existe deja avec cette adresse e-mail.');
    }

    const account: UserAccount = {
      id: this.createId('user'),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email,
      phone: data.phone.trim(),
      birthDate: data.birthDate,
      nationality: data.nationality,
      school: data.school.trim(),
      program: data.program.trim(),
      passwordHash: await this.hashPassword(data.password),
      createdAt: new Date().toISOString(),
    };

    this.saveUsers([...users, account]);
    return this.setSession(account);
  }

  async login(emailValue: string, password: string): Promise<UserSession> {
    const email = this.normalizeEmail(emailValue);
    const user = this.loadUsers().find((account) => this.normalizeEmail(account.email) === email);

    if (!user || user.passwordHash !== await this.hashPassword(password)) {
      throw new Error('Adresse e-mail ou mot de passe incorrect.');
    }

    return this.setSession(user);
  }

  logout() {
    this.removeItem(this.sessionKey);
    this.currentUser.set(null);
  }

  requestPasswordReset(emailValue: string): { token: string; expiresAt: string } {
    const email = this.normalizeEmail(emailValue);
    const user = this.loadUsers().find((account) => this.normalizeEmail(account.email) === email);

    if (!user) {
      throw new Error('Aucun compte utilisateur ne correspond a cette adresse.');
    }

    const request: PasswordResetRequest = {
      email,
      token: String(Math.floor(100000 + Math.random() * 900000)),
      expiresAt: new Date(Date.now() + 1000 * 60 * 20).toISOString(),
    };

    const resets = this.loadResetRequests().filter((item) => item.email !== email);
    this.saveResetRequests([...resets, request]);

    return { token: request.token, expiresAt: request.expiresAt };
  }

  async resetPassword(emailValue: string, token: string, password: string): Promise<void> {
    const email = this.normalizeEmail(emailValue);
    const resets = this.loadResetRequests();
    const request = resets.find((item) => item.email === email && item.token === token.trim());

    if (!request) {
      throw new Error('Code de verification invalide.');
    }

    if (new Date(request.expiresAt).getTime() < Date.now()) {
      this.saveResetRequests(resets.filter((item) => item !== request));
      throw new Error('Ce code a expire. Demandez un nouveau code.');
    }

    const users = this.loadUsers();
    const userIndex = users.findIndex((account) => this.normalizeEmail(account.email) === email);

    if (userIndex < 0) {
      throw new Error('Compte introuvable.');
    }

    users[userIndex] = {
      ...users[userIndex],
      passwordHash: await this.hashPassword(password),
    };

    this.saveUsers(users);
    this.saveResetRequests(resets.filter((item) => item !== request));
  }

  private setSession(account: UserAccount): UserSession {
    const session: UserSession = {
      id: account.id,
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      phone: account.phone,
    };

    this.setItem(this.sessionKey, JSON.stringify(session));
    this.currentUser.set(session);
    return session;
  }

  private loadUsers(): UserAccount[] {
    return this.parseJson<UserAccount[]>(this.getItem(this.usersKey), []);
  }

  private saveUsers(users: UserAccount[]) {
    this.setItem(this.usersKey, JSON.stringify(users));
  }

  private loadSession(): UserSession | null {
    return this.parseJson<UserSession | null>(this.getItem(this.sessionKey), null);
  }

  private loadResetRequests(): PasswordResetRequest[] {
    return this.parseJson<PasswordResetRequest[]>(this.getItem(this.resetsKey), []);
  }

  private saveResetRequests(requests: PasswordResetRequest[]) {
    this.setItem(this.resetsKey, JSON.stringify(requests));
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private async hashPassword(password: string): Promise<string> {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const bytes = new TextEncoder().encode(password);
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
    }

    return `plain:${password}`;
  }

  private createId(prefix: string): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return `${prefix}-${crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
