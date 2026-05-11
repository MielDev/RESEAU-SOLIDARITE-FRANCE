import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppointmentService, AppointmentSlot } from '../../services/appointment.service';
import { AdminAlertService } from '../admin-alert.service';

type SlotForm = {
  label: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  notes: string;
};

@Component({
  selector: 'app-admin-creneaux',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-creneaux.html',
  styleUrl: './admin-creneaux.css',
})
export class AdminCreneaux implements OnInit {
  private readonly appointments = inject(AppointmentService);
  private readonly alerts = inject(AdminAlertService);

  readonly slots = this.appointments.slots;
  readonly minDate = new Date().toISOString().slice(0, 10);

  editingSlotId: string | null = null;
  errorMessage = '';
  slotForm: SlotForm = this.createEmptyForm();

  ngOnInit() {
    void this.loadSlots();
  }

  saveSlot() {
    void this.saveSlotAsync();
  }

  private async saveSlotAsync() {
    this.errorMessage = '';

    if (!this.isValidSlot()) {
      return;
    }

    try {
      if (this.editingSlotId) {
        await this.appointments.updateSlot(this.editingSlotId, this.toPayload());
        void this.alerts.toastSuccess('Creneau mis a jour');
      } else {
        await this.appointments.createSlot(this.toPayload());
        void this.alerts.toastSuccess('Creneau ajoute');
      }

      this.cancelEdit();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Enregistrement impossible.';
    }
  }

  editSlot(slot: AppointmentSlot) {
    this.editingSlotId = slot.id;
    this.slotForm = {
      label: slot.label,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      location: slot.location,
      notes: slot.notes,
    };
  }

  cancelEdit() {
    this.editingSlotId = null;
    this.slotForm = this.createEmptyForm();
  }

  async deleteSlot(slot: AppointmentSlot) {
    const confirmed = await this.alerts.confirm({
      title: 'Supprimer ce creneau ?',
      text: 'Cette action est possible uniquement si aucun rendez-vous ne l utilise.',
      confirmText: 'Supprimer',
    });

    if (!confirmed) {
      return;
    }

    try {
      await this.appointments.deleteSlot(slot.id);
      void this.alerts.toastSuccess('Creneau supprime');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Suppression impossible.';
      void this.alerts.error('Suppression impossible', message);
    }
  }

  isBooked(slot: AppointmentSlot): boolean {
    return this.appointments.isSlotBooked(slot.id);
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(`${date}T00:00:00`));
  }

  private isValidSlot(): boolean {
    if (!this.slotForm.label.trim() || !this.slotForm.date || !this.slotForm.startTime || !this.slotForm.endTime) {
      this.errorMessage = 'Le titre, la date et les horaires sont obligatoires.';
      return false;
    }

    if (this.slotForm.startTime >= this.slotForm.endTime) {
      this.errorMessage = "L'heure de fin doit etre apres l'heure de debut.";
      return false;
    }

    return true;
  }

  private toPayload(): Omit<AppointmentSlot, 'id' | 'createdAt'> {
    return {
      label: this.slotForm.label.trim(),
      date: this.slotForm.date,
      startTime: this.slotForm.startTime,
      endTime: this.slotForm.endTime,
      location: this.slotForm.location.trim(),
      notes: this.slotForm.notes.trim(),
    };
  }

  private createEmptyForm(): SlotForm {
    return {
      label: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      notes: '',
    };
  }

  private async loadSlots() {
    try {
      await this.appointments.refreshAdminSlots();
    } catch {
      this.errorMessage = 'Les creneaux ne peuvent pas etre charges pour le moment.';
    }
  }
}
