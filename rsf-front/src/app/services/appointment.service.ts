import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserAuthService } from './user-auth.service';

export type AppointmentSlot = {
  id: string;
  label: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  notes: string;
  isActive?: boolean;
  isBooked?: boolean;
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
  status?: string;
};

export type AppointmentWithSlot = AppointmentBooking & {
  slot: AppointmentSlot | null;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
};

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private readonly apiUrl = `${environment.apiUrl}/appointments`;

  readonly slots = signal<AppointmentSlot[]>([]);
  readonly bookings = signal<AppointmentBooking[]>([]);

  constructor(
    private readonly http: HttpClient,
    private readonly auth: UserAuthService,
  ) {
    void this.refreshPublicSlots();
  }

  async refreshPublicSlots(): Promise<AppointmentSlot[]> {
    const response = await firstValueFrom(this.http.get<ApiResponse<AppointmentSlot[]>>(`${this.apiUrl}/slots`));
    const slots = this.sortSlots((response.data ?? []).map((slot) => this.normalizeSlot(slot)));
    this.slots.set(slots);
    return slots;
  }

  async refreshAdminSlots(): Promise<AppointmentSlot[]> {
    const response = await firstValueFrom(this.http.get<ApiResponse<AppointmentSlot[]>>(`${this.apiUrl}/admin/slots`));
    const slots = this.sortSlots((response.data ?? []).map((slot) => this.normalizeSlot(slot)));
    this.slots.set(slots);
    return slots;
  }

  async refreshBookings(): Promise<AppointmentBooking[]> {
    const response = await firstValueFrom(this.http.get<ApiResponse<AppointmentBooking[]>>(`${this.apiUrl}/admin/bookings`));
    const bookings = this.sortBookings((response.data ?? []).map((booking) => this.normalizeBooking(booking)));
    this.bookings.set(bookings);
    return bookings;
  }

  async refreshMyBooking(): Promise<AppointmentWithSlot | null> {
    const response = await firstValueFrom(this.http.get<ApiResponse<AppointmentWithSlot | null>>(
      `${this.apiUrl}/bookings/me`,
      { headers: this.auth.getAuthHeaders() }
    ));
    return response.data ? this.normalizeBooking(response.data) as AppointmentWithSlot : null;
  }

  async createSlot(payload: Omit<AppointmentSlot, 'id' | 'createdAt'>): Promise<AppointmentSlot> {
    const response = await firstValueFrom(this.http.post<ApiResponse<AppointmentSlot>>(`${this.apiUrl}/admin/slots`, payload));
    await this.refreshAdminSlots();
    return this.normalizeSlot(response.data as AppointmentSlot);
  }

  async updateSlot(id: string, payload: Omit<AppointmentSlot, 'id' | 'createdAt'>): Promise<AppointmentSlot> {
    const response = await firstValueFrom(this.http.put<ApiResponse<AppointmentSlot>>(`${this.apiUrl}/admin/slots/${id}`, payload));
    await this.refreshAdminSlots();
    return this.normalizeSlot(response.data as AppointmentSlot);
  }

  async deleteSlot(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/admin/slots/${id}`));
    await this.refreshAdminSlots();
  }

  async bookSlot(slotId: string): Promise<AppointmentBooking> {
    const response = await firstValueFrom(this.http.post<ApiResponse<AppointmentBooking>>(
      `${this.apiUrl}/bookings`,
      { slotId },
      { headers: this.auth.getAuthHeaders() }
    ));
    await this.refreshPublicSlots();
    return this.normalizeBooking(response.data as AppointmentBooking);
  }

  async rescheduleMyBooking(slotId: string): Promise<AppointmentBooking> {
    const response = await firstValueFrom(this.http.put<ApiResponse<AppointmentBooking>>(
      `${this.apiUrl}/bookings/me`,
      { slotId },
      { headers: this.auth.getAuthHeaders() }
    ));
    await this.refreshPublicSlots();
    return this.normalizeBooking(response.data as AppointmentBooking);
  }

  async cancelMyBooking(): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/bookings/me`, { headers: this.auth.getAuthHeaders() }));
    await this.refreshPublicSlots();
  }

  async deleteBooking(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/admin/bookings/${id}`));
    await this.refreshBookings();
    await this.refreshAdminSlots();
  }

  getBookingsWithSlots(): AppointmentWithSlot[] {
    return this.bookings().map((booking) => this.normalizeBooking(booking) as AppointmentWithSlot);
  }

  getBookingForUser(userId: string): AppointmentWithSlot | null {
    return this.getBookingsWithSlots().find((booking) => booking.userId === userId) ?? null;
  }

  isSlotBooked(slotId: string): boolean {
    const slot = this.slots().find((item) => item.id === slotId);
    return Boolean(slot?.isBooked) || this.bookings().some((booking) => booking.slotId === slotId);
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

  private normalizeSlot(slot: AppointmentSlot): AppointmentSlot {
    return {
      ...slot,
      id: String(slot.id),
      location: slot.location || '',
      notes: slot.notes || '',
      createdAt: slot.createdAt || '',
    };
  }

  private normalizeBooking(booking: AppointmentBooking | AppointmentWithSlot): AppointmentBooking | AppointmentWithSlot {
    const normalized = {
      ...booking,
      id: String(booking.id),
      slotId: String(booking.slotId),
      userId: String(booking.userId),
      slot: 'slot' in booking && booking.slot ? this.normalizeSlot(booking.slot) : null,
    };

    return normalized;
  }
}
