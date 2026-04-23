import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private apiUrl = `${environment.apiUrl}/public`;

  constructor(private http: HttpClient) {}

  // Contenu d'une page
  getPageContent(pageKey: string): Observable<any> {
    return this.http.get<{ success: boolean, data: any }>(`${this.apiUrl}/pages/${pageKey}`).pipe(
      map(res => res.data)
    );
  }

  // Membres équipe
  getTeam(): Observable<any[]> {
    return this.http.get<{ success: boolean, data: any[] }>(`${this.apiUrl}/team`).pipe(
      map(res => res.data)
    );
  }

  // Missions
  getMissions(): Observable<any[]> {
    return this.http.get<{ success: boolean, data: any[] }>(`${this.apiUrl}/missions`).pipe(
      map(res => res.data)
    );
  }

  // Actions solidaires publiées
  getActionsSolidaires(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/actions-solidaires`);
  }

  // Témoignages
  getTestimonials(): Observable<any[]> {
    return this.http.get<{ success: boolean, data: any[] }>(`${this.apiUrl}/testimonials`).pipe(
      map(res => res.data)
    );
  }

  // Événements
  getEvents(): Observable<any[]> {
    return this.http.get<{ success: boolean, data: any[] }>(`${this.apiUrl}/events`).pipe(
      map(res => res.data)
    );
  }

  // Actualités
  getActualities(): Observable<any[]> {
    return this.http.get<{ success: boolean, data: any[] }>(`${this.apiUrl}/actualities`).pipe(
      map(res => res.data)
    );
  }

  // Paramètres globaux
  getSettings(): Observable<any> {
    return this.http.get<{ success: boolean, data: any }>(`${this.apiUrl}/settings`).pipe(
      map(res => res.data)
    );
  }

  // Navigation
  getNav(): Observable<any[]> {
    return this.http.get<{ success: boolean, data: any[] }>(`${this.apiUrl}/nav`).pipe(
      map(res => res.data)
    );
  }

  // Contact (envoi de message)
  sendContactMessage(messageData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/contact`, messageData);
  }
}
