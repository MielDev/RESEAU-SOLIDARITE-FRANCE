import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
  encapsulation: ViewEncapsulation.None,
})
export class AdminLogin {
  email = 'admin@reseau-solidarite-france.fr';
  password = '';

  constructor(private readonly router: Router) {}

  login(): void {
    this.router.navigateByUrl('/admin/dashboard');
  }
}
