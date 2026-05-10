import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserAuthService } from '../../services/user-auth.service';

type CountryApiResult = {
  name?: {
    common?: string;
  };
  translations?: {
    fra?: {
      common?: string;
    };
  };
};

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription implements OnInit {
  readonly fallbackNationalities = [
    'Afghane',
    'Algerienne',
    'Allemande',
    'Belge',
    'Beninoise',
    'Britannique',
    'Burkinabe',
    'Camerounaise',
    'Canadienne',
    'Chinoise',
    'Congolaise',
    'Espagnole',
    'Francaise',
    'Gabonaise',
    'Guineenne',
    'Ivoirienne',
    'Italienne',
    'Malienne',
    'Marocaine',
    'Portugaise',
    'Senegalaise',
    'Togolaise',
    'Tunisienne',
  ];

  countries: string[] = [...this.fallbackNationalities].sort((left, right) => left.localeCompare(right, 'fr'));
  isLoadingCountries = false;
  isSubmitting = false;
  errorMessage = '';

  form = {
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    nationality: '',
    school: '',
    program: '',
    acceptedTerms: false,
  };

  constructor(
    private readonly http: HttpClient,
    private readonly auth: UserAuthService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.loadNationalities();
  }

  async submit() {
    this.errorMessage = '';

    if (!this.isFormValid()) {
      return;
    }

    this.isSubmitting = true;

    try {
      await this.auth.register({
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        email: this.form.email,
        password: this.form.password,
        phone: this.form.phone,
        birthDate: this.form.birthDate,
        nationality: this.form.nationality,
        school: this.form.school,
        program: this.form.program,
      });

      await this.router.navigate(['/rendez-vous']);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Inscription impossible pour le moment.';
    } finally {
      this.isSubmitting = false;
    }
  }

  private loadNationalities() {
    this.isLoadingCountries = true;

    this.http.get<CountryApiResult[]>('https://restcountries.com/v3.1/all?fields=name,translations').subscribe({
      next: (countries) => {
        const names = countries
          .map((country) => country.translations?.fra?.common || country.name?.common || '')
          .map((name) => name.trim())
          .filter(Boolean);

        this.countries = Array.from(new Set([...names, ...this.fallbackNationalities])).sort((left, right) =>
          left.localeCompare(right, 'fr')
        );
        this.isLoadingCountries = false;
      },
      error: () => {
        this.countries = [...this.fallbackNationalities].sort((left, right) => left.localeCompare(right, 'fr'));
        this.isLoadingCountries = false;
      },
    });
  }

  private isFormValid(): boolean {
    const requiredValues = [
      this.form.lastName,
      this.form.firstName,
      this.form.email,
      this.form.password,
      this.form.confirmPassword,
      this.form.phone,
      this.form.birthDate,
      this.form.nationality,
      this.form.school,
      this.form.program,
    ];

    if (requiredValues.some((value) => !value.trim()) || !this.form.acceptedTerms) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires et accepter les conditions.';
      return false;
    }

    if (this.form.password.length < 8) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 8 caracteres.';
      return false;
    }

    if (this.form.password !== this.form.confirmPassword) {
      this.errorMessage = 'La confirmation du mot de passe ne correspond pas.';
      return false;
    }

    return true;
  }
}
