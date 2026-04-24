import { AfterViewInit, Component, ElementRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminUiService } from '../shared/admin-ui.service';

@Component({
  selector: 'app-admin-temoignages',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-temoignages.html',
  styleUrl: './admin-temoignages.css',
})
export class AdminTemoignages implements AfterViewInit {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ui = inject(AdminUiService);

  readonly showNewTesti = signal(false);

  ngAfterViewInit(): void {
    this.ui.bindPageInteractions(this.host.nativeElement);
  }
}
