import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserAuthService } from '../../services/user-auth.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './connexion.html',
  styleUrl: './connexion.css',
})
export class Connexion {
  form = {
    email: '',
    password: '',
  };

  isSubmitting = false;
  errorMessage = '';

  constructor(
    private readonly auth: UserAuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  async submit() {
    this.errorMessage = '';

    if (!this.form.email.trim() || !this.form.password.trim()) {
      this.errorMessage = 'Veuillez renseigner votre adresse e-mail et votre mot de passe.';
      return;
    }

    this.isSubmitting = true;

    try {
      await this.auth.login(this.form.email, this.form.password);
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/rendez-vous';
      await this.router.navigateByUrl(returnUrl);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Connexion impossible pour le moment.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
