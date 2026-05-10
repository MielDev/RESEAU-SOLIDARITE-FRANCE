import { Injectable, signal } from '@angular/core';
import { UserSession } from './user-auth.service';

export type AppointmentSlot = {
  id: string;
  label: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  notes: string;
  createdAt: string;
};

export type AppointmentBooking = {
  id: string;
  slotId: string;
  userId: string;
  userName: string;
  email: string;
  phone: string;
  bookedAt: string;
};

export type AppointmentWithSlot = AppointmentBooking & {
  slot: AppointmentSlot | null;
};

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private readonly slotsKey = 'rsf-help-appointment-slots';
  private readonly bookingsKey = 'rsf-help-appointment-bookings';

  readonly slots = signal<AppointmentSlot[]>(this.sortSlots(this.loadSlots()));
  readonly bookings = signal<AppointmentBooking[]>(this.sortBookings(this.loadBookings()));

  createSlot(payload: Omit<AppointmentSlot, 'id' | 'createdAt'>): AppointmentSlot {
    const slot: AppointmentSlot = {
      ...payload,
      id: this.createId('slot'),
      createdAt: new Date().toISOString(),
    };

    const slots = this.sortSlots([...this.slots(), slot]);
    this.saveSlots(slots);
    this.slots.set(slots);

    return slot;
  }

  updateSlot(id: string, payload: Omit<AppointmentSlot, 'id' | 'createdAt'>): AppointmentSlot {
    const slots = this.slots();
    const existing = slots.find((slot) => slot.id === id);

    if (!existing) {
      throw new Error('Creneau introuvable.');
    }

    const nextSlot: AppointmentSlot = {
      ...existing,
      ...payload,
    };

    const nextSlots = this.sortSlots(slots.map((slot) => (slot.id === id ? nextSlot : slot)));
    this.saveSlots(nextSlots);
    this.slots.set(nextSlots);

    return nextSlot;
  }

  deleteSlot(id: string) {
    if (this.bookings().some((booking) => booking.slotId === id)) {
      throw new Error('Ce creneau a deja un rendez-vous. Supprimez le rendez-vous avant de retirer le creneau.');
    }

    const slots = this.slots().filter((slot) => slot.id !== id);
    this.saveSlots(slots);
    this.slots.set(slots);
  }

  bookSlot(slotId: string, user: UserSession): AppointmentBooking {
    const slot = this.slots().find((item) => item.id === slotId);

    if (!slot) {
      throw new Error('Creneau introuvable.');
    }

    if (this.isSlotBooked(slotId)) {
      throw new Error('Ce creneau vient deja d etre reserve.');
    }

    const booking: AppointmentBooking = {
      id: this.createId('booking'),
      slotId,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      phone: user.phone,
      bookedAt: new Date().toISOString(),
    };

    const bookings = this.sortBookings([...this.bookings(), booking]);
    this.saveBookings(bookings);
    this.bookings.set(bookings);

    return booking;
  }

  deleteBooking(id: string) {
    const bookings = this.bookings().filter((booking) => booking.id !== id);
    this.saveBookings(bookings);
    this.bookings.set(bookings);
  }

  getBookingsWithSlots(): AppointmentWithSlot[] {
    const slotMap = new Map(this.slots().map((slot) => [slot.id, slot]));
    return this.bookings().map((booking) => ({
      ...booking,
      slot: slotMap.get(booking.slotId) ?? null,
    }));
  }

  getBookingForUser(userId: string): AppointmentWithSlot | null {
    return this.getBookingsWithSlots().find((booking) => booking.userId === userId) ?? null;
  }

  isSlotBooked(slotId: string): boolean {
    return this.bookings().some((booking) => booking.slotId === slotId);
  }

  private loadSlots(): AppointmentSlot[] {
    return this.parseJson<AppointmentSlot[]>(this.getItem(this.slotsKey), []);
  }

  private saveSlots(slots: AppointmentSlot[]) {
    this.setItem(this.slotsKey, JSON.stringify(slots));
  }

  private loadBookings(): AppointmentBooking[] {
    return this.parseJson<AppointmentBooking[]>(this.getItem(this.bookingsKey), []);
  }

  private saveBookings(bookings: AppointmentBooking[]) {
    this.setItem(this.bookingsKey, JSON.stringify(bookings));
  }

  private sortSlots(slots: AppointmentSlot[]): AppointmentSlot[] {
    return [...slots].sort((left, right) => {
      const leftDate = `${left.date}T${left.startTime}`;
      const rightDate = `${right.date}T${right.startTime}`;
      return leftDate.localeCompare(rightDate);
    });
  }

  private sortBookings(bookings: AppointmentBooking[]): AppointmentBooking[] {
    return [...bookings].sort((left, right) => right.bookedAt.localeCompare(left.bookedAt));
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
