import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { firstValueFrom, forkJoin } from 'rxjs';
import { AdminAlertService } from '../admin-alert.service';
import { AdminApiService } from '../admin-api.service';

@Component({
  selector: 'app-admin-rencontre',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-rencontre.html',
  styleUrl: './admin-rencontre.css',
})
export class AdminRencontre implements OnInit {
  data: any = {};
  eventPhotos: any[] = [];
  saving = false;
  readonly acceptedPhotoTypes = 'image/jpeg,image/png,image/webp,image/gif';
  private readonly maxPhotoSize = 8 * 1024 * 1024;
  private pageData: any = {};
  private eventData: any = {};
  private photoId = 0;

  constructor(
    private api: AdminApiService,
    private alerts: AdminAlertService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      page: this.api.getPage('rencontre-annuelle'),
      events: this.api.listResource<any>('events'),
    }).subscribe(({ page, events }) => {
      this.pageData = page || {};
      this.eventData = events.find((event) => event.is_featured) ?? events[0] ?? {};
      this.data = this.toFormData(this.pageData, this.eventData);
      this.eventPhotos = this.toPhotoViewModels(this.eventData.photos);
    });
  }

  save() {
    if (this.saving) return;

    this.saving = true;
    const pageRequest = this.api.updatePage('rencontre-annuelle', this.toPageData());
    const eventPayload = this.toEventData();
    const eventRequest = eventPayload.id
      ? this.api.updateResource('events', eventPayload.id, eventPayload)
      : this.api.createResource('events', eventPayload);

    forkJoin([pageRequest, eventRequest]).subscribe({
      next: () => {
        this.saving = false;
        void this.alerts.success('Modifications enregistrees', 'La rencontre annuelle a bien ete mise a jour.');
      },
      error: () => {
        this.saving = false;
        void this.alerts.error('Enregistrement impossible', 'La rencontre annuelle n a pas pu etre sauvegardee.');
      },
    });
  }

  private toFormData(page: any, event: any) {
    const program = Array.isArray(event?.program) ? event.program : [];
    const form: any = {
      ra_title: event?.title ?? page?.content?.aboutTitle ?? '',
      ra_edition: event?.edition ?? '',
      ra_date: event?.event_date ?? '',
      ra_start: event?.time_start ?? '',
      ra_end: event?.time_end ?? '',
      ra_place: event?.location ?? '',
      ra_email: event?.contact_email ?? '',
      ra_web: event?.contact_website ?? '',
      ra_desc: event?.description ?? page?.content?.aboutIntro ?? '',
      ra_cta: page?.content?.ctaText ?? '',
      ra_btn: event?.cta_text ?? '',
      ra_href: event?.cta_href ?? '',
    };

    for (let index = 1; index <= 6; index += 1) {
      const item = program[index - 1] ?? {};
      form[`prog${index}_title`] = item.title ?? '';
      form[`prog${index}_time`] = item.subtitle ?? item.time ?? '';
    }

    return form;
  }

  private toPageData() {
    return {
      ...this.pageData,
      content: {
        ...(this.pageData.content ?? {}),
        aboutTitle: this.data.ra_title,
        aboutIntro: this.data.ra_desc,
        ctaText: this.data.ra_cta,
      },
    };
  }

  private toEventData() {
    return {
      ...this.eventData,
      title: this.data.ra_title,
      edition: this.data.ra_edition,
      event_date: this.data.ra_date,
      time_start: this.data.ra_start,
      time_end: this.data.ra_end,
      location: this.data.ra_place,
      contact_email: this.data.ra_email,
      contact_website: this.data.ra_web,
      description: this.data.ra_desc,
      cta_text: this.data.ra_btn,
      cta_href: this.data.ra_href,
      is_featured: this.eventData.is_featured ?? true,
      is_published: this.eventData.is_published ?? true,
      photos: this.eventPhotos
        .map((photo, index) => ({
          image_url: String(photo.image_url || '').trim(),
          alt_text: String(photo.alt_text || '').trim(),
          caption: String(photo.caption || '').trim(),
          sort_order: index,
        }))
        .filter((photo) => photo.image_url),
      program: [1, 2, 3, 4, 5, 6].map((index) => ({
        ...(this.eventData.program?.[index - 1] ?? {}),
        title: this.data[`prog${index}_title`],
        subtitle: this.data[`prog${index}_time`],
      })),
    };
  }

  addPhoto() {
    this.eventPhotos = [
      ...this.eventPhotos,
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

    if (!file) return;

    if (!this.validatePhotoFile(file)) {
      return;
    }

    const currentPhoto = this.eventPhotos[photoIndex] ?? {};
    const clientId = currentPhoto.client_id || this.nextPhotoId();
    this.patchPhoto(photoIndex, { client_id: clientId, is_uploading: true, upload_error: false });

    await this.uploadPhotoFile(file, clientId, currentPhoto.alt_text);
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

    this.eventPhotos = [...this.eventPhotos, ...placeholders];

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

  removePhoto(index: number) {
    this.eventPhotos = this.eventPhotos.filter((_photo, photoIndex) => photoIndex !== index);
  }

  movePhoto(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= this.eventPhotos.length) return;

    const photos = [...this.eventPhotos];
    const [photo] = photos.splice(index, 1);
    photos.splice(nextIndex, 0, photo);
    this.eventPhotos = photos;
  }

  trackByIndex(index: number) {
    return index;
  }

  private toPhotoViewModels(photos: unknown) {
    return Array.isArray(photos)
      ? [...photos]
          .sort((a: any, b: any) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
          .map((photo: any) => ({
            client_id: this.nextPhotoId(),
            image_url: photo.image_url || photo.imageUrl || photo.url || '',
            alt_text: photo.alt_text || photo.altText || '',
            caption: photo.caption || '',
            is_uploading: false,
          }))
      : [];
  }

  private patchPhoto(index: number, patch: Record<string, unknown>) {
    this.eventPhotos = this.eventPhotos.map((photo, photoIndex) =>
      photoIndex === index ? { ...photo, ...patch } : photo,
    );
  }

  private patchPhotoByClientId(clientId: string, patch: Record<string, unknown>) {
    this.eventPhotos = this.eventPhotos.map((photo) =>
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
    return `rencontre-photo-${Date.now()}-${this.photoId}`;
  }
}
