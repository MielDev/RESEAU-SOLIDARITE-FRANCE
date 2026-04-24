import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  text: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class AdminUiService {
  readonly toast = signal<ToastMessage | null>(null);
  readonly sidebarOpen = signal(false);

  private toastTimeout?: ReturnType<typeof setTimeout>;

  showToast(text = 'Modifications enregistrées !', icon = '✅'): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toast.set({ text, icon });
    this.toastTimeout = setTimeout(() => this.toast.set(null), 3000);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  /**
   * Wires up "save" buttons and tab switching inside the given host element.
   * Mirrors the behaviour that was inlined in the original admin HTML files.
   */
  bindPageInteractions(host: HTMLElement): void {
    host.querySelectorAll<HTMLElement>('.tb-save,.btn-save').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const originalLabel = btn.dataset['label'] || btn.innerHTML;
        btn.dataset['label'] = originalLabel;
        btn.innerHTML = '<span>⏳</span> Enregistrement…';
        setTimeout(() => {
          btn.innerHTML = originalLabel;
          this.showToast();
        }, 800);
      });
    });

    host.querySelectorAll<HTMLElement>('.tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const group = tab.closest('.tabs-wrap');
        if (group) return;
        host.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
        host
          .querySelectorAll<HTMLElement>('.tab-panel')
          .forEach((x) => (x.style.display = 'none'));
        tab.classList.add('active');
        const target = host.querySelector<HTMLElement>(
          '#panel-' + tab.dataset['tab'],
        );
        if (target) target.style.display = 'block';
      });
    });
  }
}
