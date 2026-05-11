import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppointmentService, AppointmentWithSlot } from '../../services/appointment.service';
import { AdminAlertService } from '../admin-alert.service';

@Component({
  selector: 'app-admin-rendez-vous',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-rendez-vous.html',
  styleUrl: './admin-rendez-vous.css',
})
export class AdminRendezVous implements OnInit {
  private readonly appointments = inject(AppointmentService);
  private readonly alerts = inject(AdminAlertService);

  readonly appointmentsList = computed(() => this.appointments.getBookingsWithSlots());

  ngOnInit() {
    void this.loadBookings();
  }

  async deleteBooking(booking: AppointmentWithSlot) {
    const confirmed = await this.alerts.confirm({
      title: 'Liberer ce creneau ?',
      text: 'Le rendez-vous sera retire de la liste et le creneau redeviendra disponible.',
      confirmText: 'Liberer',
    });

    if (!confirmed) {
      return;
    }

    await this.appointments.deleteBooking(booking.id);
    void this.alerts.toastSuccess('Rendez-vous retire');
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(`${date}T00:00:00`));
  }

  formatDateTime(date: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  private async loadBookings() {
    try {
      await this.appointments.refreshBookings();
    } catch {
      void this.alerts.toastError('Les rendez-vous ne peuvent pas etre charges.');
    }
  }
}
