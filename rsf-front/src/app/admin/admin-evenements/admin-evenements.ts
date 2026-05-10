import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AdminAlertService } from '../admin-alert.service';
import { AdminApiService } from '../admin-api.service';
import { AdminPageDetailsEditor } from '../shared/admin-page-details-editor/admin-page-details-editor';

@Component({
  selector: 'app-admin-evenements',
  imports: [FormsModule, RouterModule, CommonModule, AdminPageDetailsEditor],
  templateUrl: './admin-evenements.html',
  styleUrl: './admin-evenements.css',
})
export class AdminEvenements implements OnInit {
  events: any[] = [];
  showForm = false;
  editing = false;
  saving = false;
  currentEvent: any = {};
  readonly acceptedPhotoTypes = 'image/jpeg,image/png,image/webp,image/gif';
  private readonly maxPhotoSize = 8 * 1024 * 1024;
  private photoId = 0;

  constructor(
    private api: AdminApiService,
    private alerts: AdminAlertService
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.api.listResource('events').subscribe(events => {
      this.events = events.map((event) => this.toViewModel(event));
    });
  }

  addNew() {
    this.currentEvent = {
      time_start: '10:00',
      time_end: '22:00',
      cta_text: 'Je participe',
      cta_href: '/nous-rejoindre',
      is_published: true,
      is_featured: false,
      photos: [],
    };
    this.editing = false;
    this.showForm = true;
  }

  edit(event: any) {
    this.currentEvent = this.toViewModel(event);
    this.editing = true;
    this.showForm = true;
  }

  saveEvent() {
    if (this.saving) return;

    this.saving = true;
    const request = this.editing
      ? this.api.updateResource('events', this.currentEvent.id, this.toPayload())
      : this.api.createResource('events', this.toPayload());

    request.subscribe({
      next: () => {
        this.saving = false;
        this.loadEvents();
        this.showForm = false;
        void this.alerts.success('Evenement enregistre', 'La liste des evenements a bien ete mise a jour.');
      },
      error: () => {
        this.saving = false;
        void this.alerts.error('Enregistrement impossible', 'Cet evenement n a pas pu etre sauvegarde.');
      },
    });
  }

  async delete(event: any) {
    const confirmed = await this.alerts.confirm({
      title: 'Supprimer cet evenement ?',
      text: 'Cet evenement ne sera plus affiche apres suppression.',
      confirmText: 'Supprimer',
    });

    if (!confirmed) return;

    this.api.deleteResource('events', event.id).subscribe({
      next: () => {
        this.loadEvents();
        void this.alerts.success('Evenement supprime', 'La liste a ete mise a jour.');
      },
      error: () => {
        void this.alerts.error('Suppression impossible', 'Cet evenement n a pas pu etre supprime.');
      },
    });
  }

  cancel() {
    this.showForm = false;
  }

  addPhoto() {
    this.currentEvent.photos = [
      ...(Array.isArray(this.currentEvent.photos) ? this.currentEvent.photos : []),
      { client_id: this.nextPhotoId(), image_url: '', alt_text: '', caption: '', is_uploading: false },
    ];
  }

  onPhotosSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';

    void this.uploadNewPhotos(files);
  }

  async onPhotoSelected(event: Event, photoIndex: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file || !this.validatePhotoFile(file)) return;

    const photos = Array.isArray(this.currentEvent.photos) ? this.currentEvent.photos : [];
    const currentPhoto = photos[photoIndex] ?? {};
    const clientId = currentPhoto.client_id || this.nextPhotoId();
    this.patchPhoto(photoIndex, { client_id: clientId, is_uploading: true, upload_error: false });

    await this.uploadPhotoFile(file, clientId, currentPhoto.alt_text);
  }

  removePhoto(index: number) {
    const photos = Array.isArray(this.currentEvent.photos) ? this.currentEvent.photos : [];
    this.currentEvent.photos = photos.filter((_photo: any, photoIndex: number) => photoIndex !== index);
  }

  movePhoto(index: number, direction: -1 | 1) {
    const photos = Array.isArray(this.currentEvent.photos) ? [...this.currentEvent.photos] : [];
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= photos.length) return;

    const [photo] = photos.splice(index, 1);
    photos.splice(nextIndex, 0, photo);
    this.currentEvent.photos = photos;
  }

  trackByIndex(index: number) {
    return index;
  }

  save() {
    // Kept for route-level compatibility; each event is saved from the form.
  }

  private toViewModel(event: any) {
    return {
      ...event,
      photos: Array.isArray(event?.photos)
        ? [...event.photos]
            .sort((a: any, b: any) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
            .map((photo: any) => ({
              client_id: this.nextPhotoId(),
              image_url: photo.image_url || photo.imageUrl || photo.url || '',
              alt_text: photo.alt_text || photo.altText || '',
              caption: photo.caption || '',
              is_uploading: false,
              upload_error: false,
            }))
        : [],
    };
  }

  private toPayload() {
    return {
      ...this.currentEvent,
      photos: (Array.isArray(this.currentEvent.photos) ? this.currentEvent.photos : [])
        .map((photo: any, index: number) => ({
          image_url: String(photo.image_url || '').trim(),
          alt_text: String(photo.alt_text || '').trim(),
          caption: String(photo.caption || '').trim(),
          sort_order: index,
        }))
        .filter((photo: any) => photo.image_url),
    };
  }

  private async uploadNewPhotos(files: File[]) {
    const validFiles = files.filter((file) => this.validatePhotoFile(file));
    if (!validFiles.length) return;

    const placeholders = validFiles.map((file) => ({
      client_id: this.nextPhotoId(),
      image_url: '',
      alt_text: this.toAltText(file.name),
      caption: '',
      is_uploading: true,
      upload_error: false,
    }));

    this.currentEvent.photos = [
      ...(Array.isArray(this.currentEvent.photos) ? this.currentEvent.photos : []),
      ...placeholders,
    ];

    await Promise.all(
      validFiles.map((file, index) =>
        this.uploadPhotoFile(file, placeholders[index].client_id, placeholders[index].alt_text),
      ),
    );
  }

  private async uploadPhotoFile(file: File, clientId: string, fallbackAltText = '') {
    try {
      const dataUrl = await this.readFileAsDataUrl(file);
      const upload = await firstValueFrom(
        this.api.uploadEventPhoto({
          fileName: file.name,
          mimeType: file.type,
          dataUrl,
        }),
      );

      if (!upload.image_url) {
        throw new Error('Upload sans URL');
      }

      this.patchPhotoByClientId(clientId, {
        image_url: upload.image_url,
        alt_text: fallbackAltText || this.toAltText(file.name),
        is_uploading: false,
        upload_error: false,
      });
    } catch {
      this.patchPhotoByClientId(clientId, { is_uploading: false, upload_error: true });
      void this.alerts.error('Upload impossible', 'La photo n a pas pu etre envoyee au serveur.');
    }
  }

  private patchPhoto(index: number, patch: Record<string, unknown>) {
    const photos = Array.isArray(this.currentEvent.photos) ? this.currentEvent.photos : [];
    this.currentEvent.photos = photos.map((photo: any, photoIndex: number) =>
      photoIndex === index ? { ...photo, ...patch } : photo,
    );
  }

  private patchPhotoByClientId(clientId: string, patch: Record<string, unknown>) {
    const photos = Array.isArray(this.currentEvent.photos) ? this.currentEvent.photos : [];
    this.currentEvent.photos = photos.map((photo: any) =>
      photo.client_id === clientId ? { ...photo, ...patch } : photo,
    );
  }

  private validatePhotoFile(file: File) {
    if (!file.type.startsWith('image/')) {
      void this.alerts.error('Format invalide', 'Selectionne un fichier image.');
      return false;
    }

    if (file.size > this.maxPhotoSize) {
      void this.alerts.error('Image trop lourde', 'La taille maximale autorisee est de 8 Mo.');
      return false;
    }

    return true;
  }

  private readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  private toAltText(fileName: string) {
    return fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .trim();
  }

  private nextPhotoId() {
    this.photoId += 1;
    return `event-photo-${Date.now()}-${this.photoId}`;
  }
}
