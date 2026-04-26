import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { AdminAlertService } from '../admin-alert.service';
import { AdminApiService } from '../admin-api.service';
import { AdminIconPicker } from '../shared/admin-icon-picker/admin-icon-picker';

@Component({
  selector: 'app-admin-missions',
  imports: [FormsModule, RouterModule, AdminIconPicker],
  templateUrl: './admin-missions.html',
  styleUrl: './admin-missions.css',
})
export class AdminMissions implements OnInit {
  data: any = {};
  saving = false;
  private missions: any[] = [];

  constructor(
    private api: AdminApiService,
    private alerts: AdminAlertService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.listResource<any>('missions').subscribe(missions => {
      this.missions = missions || [];
      this.data = this.toFormData(this.missions);
    });
  }

  save() {
    if (this.saving) return;

    this.saving = true;
    const requests = this.toMissionData().map((mission) =>
      mission.id
        ? this.api.updateResource('missions', mission.id, mission)
        : this.api.createResource('missions', mission)
    );

    (requests.length ? forkJoin(requests) : of([])).subscribe({
      next: () => {
        this.saving = false;
        void this.alerts.success('Modifications enregistrees', 'Les missions ont bien ete mises a jour.');
      },
      error: () => {
        this.saving = false;
        void this.alerts.error('Enregistrement impossible', 'Les missions n ont pas pu etre sauvegardees.');
      },
    });
  }

  private toFormData(missions: any[]) {
    const form: any = {};

    for (let index = 1; index <= 5; index += 1) {
      const mission = missions[index - 1] ?? {};
      const items = Array.isArray(mission.items) ? mission.items : [];
      form[`m${index}_icon`] = mission.icon ?? '';
      form[`m${index}_title`] = mission.title ?? '';
      form[`m${index}_color`] = this.colorNameToLabel(mission.color_name);

      for (let itemIndex = 1; itemIndex <= 5; itemIndex += 1) {
        form[`m${index}_p${itemIndex}`] = this.itemText(items[itemIndex - 1]);
      }
    }

    return form;
  }

  private toMissionData() {
    return [1, 2, 3, 4, 5]
      .map((index) => ({
        ...(this.missions[index - 1] ?? {}),
        icon: this.data[`m${index}_icon`],
        title: this.data[`m${index}_title`],
        color_name: this.labelToColorName(this.data[`m${index}_color`]),
        items: [1, 2, 3, 4, 5]
          .map((itemIndex) => this.data[`m${index}_p${itemIndex}`])
          .filter(Boolean)
          .map((text) => ({ text })),
        is_active: this.missions[index - 1]?.is_active ?? true,
      }))
      .filter((mission) => mission.title || mission.icon || mission.items.length > 0);
  }

  private itemText(item: any) {
    if (typeof item === 'string') return item;
    return item?.text ?? '';
  }

  private colorNameToLabel(color: unknown) {
    switch (color) {
      case 'secondary':
        return 'Violet';
      case 'accent':
        return 'Orange';
      case 'support':
        return 'Vert';
      case 'gray':
        return 'Gris';
      default:
        return 'Bleu';
    }
  }

  private labelToColorName(label: unknown) {
    switch (label) {
      case 'Violet':
        return 'secondary';
      case 'Orange':
        return 'accent';
      case 'Vert':
        return 'support';
      case 'Gris':
        return 'gray';
      default:
        return 'primary';
    }
  }
}
