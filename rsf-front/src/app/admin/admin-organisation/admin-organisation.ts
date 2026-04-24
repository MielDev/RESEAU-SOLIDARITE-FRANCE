import { AfterViewInit, Component, ElementRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminUiService } from '../shared/admin-ui.service';

@Component({
  selector: 'app-admin-organisation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-organisation.html',
  styleUrl: './admin-organisation.css',
})
export class AdminOrganisation implements AfterViewInit {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ui = inject(AdminUiService);

  readonly showMemberForm = signal(false);

  ngAfterViewInit(): void {
    this.ui.bindPageInteractions(this.host.nativeElement);
  }
}
