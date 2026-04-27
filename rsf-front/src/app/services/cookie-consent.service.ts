import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type CookieConsentPreferences = {
  necessary: true;
  audience: boolean;
  externalServices: boolean;
};

type StoredCookieConsent = {
  version: number;
  preferences: CookieConsentPreferences;
  updatedAt: string;
  expiresAt: string;
};

@Injectable({
  providedIn: 'root',
})
export class CookieConsentService {
  private readonly storageKey = 'rsf_cookie_consent_v1';
  private readonly version = 1;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly consentState = signal<StoredCookieConsent | null>(this.readStoredConsent());

  readonly preferences = computed(() => this.consentState()?.preferences ?? this.defaultPreferences());
  readonly hasChoice = computed(() => this.consentState() !== null);
  readonly externalServicesAllowed = computed(() => this.preferences().externalServices);

  defaultPreferences(): CookieConsentPreferences {
    return {
      necessary: true,
      audience: false,
      externalServices: false,
    };
  }

  getPreferences(): CookieConsentPreferences {
    return { ...this.preferences() };
  }

  acceptAll() {
    this.savePreferences({
      necessary: true,
      audience: true,
      externalServices: true,
    });
  }

  rejectAll() {
    this.savePreferences(this.defaultPreferences());
  }

  savePreferences(preferences: CookieConsentPreferences) {
    const normalized: StoredCookieConsent = {
      version: this.version,
      preferences: {
        necessary: true,
        audience: Boolean(preferences.audience),
        externalServices: Boolean(preferences.externalServices),
      },
      updatedAt: new Date().toISOString(),
      expiresAt: this.addMonths(new Date(), 6).toISOString(),
    };

    this.consentState.set(normalized);

    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(normalized));
  }

  openPreferences() {
    if (!this.isBrowser) {
      return;
    }

    window.dispatchEvent(new CustomEvent('rsf-cookie-preferences-open'));
  }

  private readStoredConsent(): StoredCookieConsent | null {
    if (!this.isBrowser) {
      return null;
    }

    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as StoredCookieConsent;
      const expiresAt = new Date(parsed.expiresAt).getTime();

      if (parsed.version !== this.version || Number.isNaN(expiresAt) || expiresAt <= Date.now()) {
        localStorage.removeItem(this.storageKey);
        return null;
      }

      return {
        version: parsed.version,
        updatedAt: parsed.updatedAt,
        expiresAt: parsed.expiresAt,
        preferences: {
          necessary: true,
          audience: Boolean(parsed.preferences?.audience),
          externalServices: Boolean(parsed.preferences?.externalServices),
        },
      };
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  private addMonths(date: Date, months: number): Date {
    const next = new Date(date);
    next.setMonth(next.getMonth() + months);
    return next;
  }
}
