import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserAuthService } from '../../services/user-auth.service';

@Component({
  selector: 'app-mot-de-passe-oublie',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mot-de-passe-oublie.html',
  styleUrl: './mot-de-passe-oublie.css',
})
export class MotDePasseOublie {
  form = {
    email: '',
    token: '',
    password: '',
    confirmPassword: '',
  };

  resetCode = '';
  infoMessage = '';
  errorMessage = '';
  isRequesting = false;
  isResetting = false;

  constructor(
    private readonly auth: UserAuthService,
    private readonly router: Router,
  ) {}

  async requestReset() {
    this.infoMessage = '';
    this.errorMessage = '';

    if (!this.form.email.trim()) {
      this.errorMessage = 'Veuillez renseigner votre adresse e-mail.';
      return;
    }

    this.isRequesting = true;

    try {
      const reset = await this.auth.requestPasswordReset(this.form.email);
      this.resetCode = reset.token;
      this.form.token = reset.token;
      this.infoMessage = 'Code de verification cree. Il reste valable 20 minutes.';
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Demande impossible pour le moment.';
    } finally {
      this.isRequesting = false;
    }
  }

  async resetPassword() {
    this.infoMessage = '';
    this.errorMessage = '';

    if (!this.form.email.trim() || !this.form.token.trim() || !this.form.password.trim()) {
      this.errorMessage = 'Veuillez renseigner le code et le nouveau mot de passe.';
      return;
    }

    if (this.form.password.length < 8) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 8 caracteres.';
      return;
    }

    if (this.form.password !== this.form.confirmPassword) {
      this.errorMessage = 'La confirmation du mot de passe ne correspond pas.';
      return;
    }

    this.isResetting = true;

    try {
      await this.auth.resetPassword(this.form.email, this.form.token, this.form.password);
      await this.router.navigate(['/connexion']);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Reinitialisation impossible pour le moment.';
    } finally {
      this.isResetting = false;
    }
  }
}
