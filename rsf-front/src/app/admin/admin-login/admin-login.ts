import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { AdminAlertService } from '../admin-alert.service';
import { AdminAuthService } from '../admin-auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin implements OnInit, OnDestroy {
  email = '';
  password = '';
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly auth: AdminAuthService,
    private readonly alerts: AdminAlertService,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  ngOnInit() {
    this.document.body.classList.add('admin-mode');

    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  ngOnDestroy() {
    this.document.body.classList.remove('admin-mode');
  }

  submit() {
    if (this.isSubmitting) {
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    this.auth
      .login(this.email.trim(), this.password)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') || '/admin/dashboard';
          void this.alerts.toastSuccess('Connexion reussie');
          this.router.navigateByUrl(redirectTo);
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Connexion impossible. Verifie tes identifiants.';
          void this.alerts.error('Connexion impossible', this.errorMessage);
        },
      });
  }
}
