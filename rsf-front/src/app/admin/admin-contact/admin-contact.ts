import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminUiService } from '../shared/admin-ui.service';

@Component({
  selector: 'app-admin-contact',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-contact.html',
  styleUrl: './admin-contact.css',
})
export class AdminContact implements AfterViewInit {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ui = inject(AdminUiService);

  ngAfterViewInit(): void {
    this.ui.bindPageInteractions(this.host.nativeElement);
  }
}
