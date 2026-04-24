import { AfterViewInit, Component, ElementRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminUiService } from '../shared/admin-ui.service';

@Component({
  selector: 'app-admin-actualites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-actualites.html',
  styleUrl: './admin-actualites.css',
})
export class AdminActualites implements AfterViewInit {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ui = inject(AdminUiService);

  readonly showNewActu = signal(false);

  ngAfterViewInit(): void {
    this.ui.bindPageInteractions(this.host.nativeElement);
  }
}
