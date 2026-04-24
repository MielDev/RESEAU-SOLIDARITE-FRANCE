import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminUiService } from '../shared/admin-ui.service';

@Component({
  selector: 'app-admin-actions-solidaires',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-actions-solidaires.html',
  styleUrl: './admin-actions-solidaires.css',
})
export class AdminActionsSolidaires implements AfterViewInit {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ui = inject(AdminUiService);

  ngAfterViewInit(): void {
    this.ui.bindPageInteractions(this.host.nativeElement);
  }
}
