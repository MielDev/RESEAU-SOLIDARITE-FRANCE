import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppointmentService, AppointmentSlot, AppointmentWithSlot } from '../../services/appointment.service';
import { UserAuthService } from '../../services/user-auth.service';

@Component({
  selector: 'app-rendez-vous',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rendez-vous.html',
  styleUrl: './rendez-vous.css',
})
export class RendezVous implements OnInit {
  private readonly auth = inject(UserAuthService);
  private readonly appointments = inject(AppointmentService);
  private readonly router = inject(Router);

  readonly user = this.auth.currentUser;
  readonly slots = this.appointments.slots;
  readonly userBooking = signal<AppointmentWithSlot | null>(null);

  feedbackMessage = '';
  errorMessage = '';
  isChangingBooking = false;
  isSubmitting = false;

  ngOnInit() {
    void this.loadData();
  }

  book(slot: AppointmentSlot) {
    if (this.userBooking() && this.isChangingBooking) {
      void this.rescheduleAsync(slot);
      return;
    }

    void this.bookAsync(slot);
  }

  startChange() {
    this.feedbackMessage = '';
    this.errorMessage = '';
    this.isChangingBooking = true;
    void this.appointments.refreshPublicSlots();
  }

  stopChange() {
    this.isChangingBooking = false;
    this.errorMessage = '';
  }

  cancelBooking() {
    void this.cancelBookingAsync();
  }

  private async bookAsync(slot: AppointmentSlot) {
    this.feedbackMessage = '';
    this.errorMessage = '';

    const user = this.user();

    if (!user) {
      void this.router.navigate(['/connexion'], { queryParams: { returnUrl: '/rendez-vous' } });
      return;
    }

    if (this.userBooking()) {
      this.errorMessage = 'Vous avez deja un rendez-vous confirme.';
      return;
    }

    this.isSubmitting = true;

    try {
      await this.appointments.bookSlot(slot.id);
      this.userBooking.set(await this.appointments.refreshMyBooking());
      this.feedbackMessage = 'Votre rendez-vous est confirme.';
    } catch (error) {
      this.errorMessage = this.getErrorMessage(error, 'Reservation impossible pour le moment.');
    } finally {
      this.isSubmitting = false;
    }
  }

  private async rescheduleAsync(slot: AppointmentSlot) {
    this.feedbackMessage = '';
    this.errorMessage = '';

    if (!this.user()) {
      void this.router.navigate(['/connexion'], { queryParams: { returnUrl: '/rendez-vous' } });
      return;
    }

    this.isSubmitting = true;

    try {
      await this.appointments.rescheduleMyBooking(slot.id);
      this.userBooking.set(await this.appointments.refreshMyBooking());
      this.isChangingBooking = false;
      this.feedbackMessage = 'Votre rendez-vous a ete modifie.';
    } catch (error) {
      this.errorMessage = this.getErrorMessage(error, 'Modification impossible pour le moment.');
    } finally {
      this.isSubmitting = false;
    }
  }

  private async cancelBookingAsync() {
    this.feedbackMessage = '';
    this.errorMessage = '';

    if (!this.userBooking()) {
      return;
    }

    const confirmed = window.confirm('Annuler votre rendez-vous confirme ?');
    if (!confirmed) {
      return;
    }

    this.isSubmitting = true;

    try {
      await this.appointments.cancelMyBooking();
      this.userBooking.set(null);
      this.isChangingBooking = false;
      this.feedbackMessage = 'Votre rendez-vous a ete annule. Vous pouvez choisir un nouveau creneau.';
    } catch (error) {
      this.errorMessage = this.getErrorMessage(error, 'Annulation impossible pour le moment.');
    } finally {
      this.isSubmitting = false;
    }
  }

  logout() {
    this.auth.logout();
    void this.router.navigate(['/connexion']);
  }

  isSlotBooked(slot: AppointmentSlot): boolean {
    return this.appointments.isSlotBooked(slot.id);
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(`${date}T00:00:00`));
  }

  private async loadData() {
    try {
      await this.appointments.refreshPublicSlots();
      if (this.user()) {
        this.userBooking.set(await this.appointments.refreshMyBooking());
      }
    } catch {
      this.errorMessage = 'Les creneaux ne peuvent pas etre charges pour le moment.';
    }
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const apiMessage = typeof error.error?.message === 'string' ? error.error.message : '';
      return apiMessage || fallback;
    }

    return error instanceof Error ? error.message : fallback;
  }
}
