import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppointmentService, AppointmentSlot } from '../../services/appointment.service';
import { UserAuthService } from '../../services/user-auth.service';

@Component({
  selector: 'app-rendez-vous',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rendez-vous.html',
  styleUrl: './rendez-vous.css',
})
export class RendezVous {
  readonly user = this.auth.currentUser;
  readonly slots = this.appointments.slots;
  readonly userBooking = computed(() => {
    const user = this.user();
    return user ? this.appointments.getBookingForUser(user.id) : null;
  });

  feedbackMessage = '';
  errorMessage = '';

  constructor(
    private readonly auth: UserAuthService,
    private readonly appointments: AppointmentService,
    private readonly router: Router,
  ) {}

  book(slot: AppointmentSlot) {
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

    try {
      this.appointments.bookSlot(slot.id, user);
      this.feedbackMessage = 'Votre rendez-vous est confirme.';
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Reservation impossible pour le moment.';
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
}
