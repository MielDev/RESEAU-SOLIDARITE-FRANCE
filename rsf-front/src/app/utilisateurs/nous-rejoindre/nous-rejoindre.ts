import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PublicService } from '../../services/public.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nous-rejoindre',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './nous-rejoindre.html',
  styleUrl: './nous-rejoindre.css',
})
export class NousRejoindre implements OnInit {
  pageContent: any = null;
  statusOptions: string[] = [];
  intentOptions: string[] = [];
  interestOptions: string[] = [];
  joinData = {
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    status: '',
    city: '',
    intent: '',
    interests: [] as string[],
    message: ''
  };
  isSubmitting = false;

  constructor(
    private renderer: Renderer2,
    private publicService: PublicService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.pageContent = data.pageContent ?? null;
      this.statusOptions = Array.isArray(this.pageContent?.form?.statusOptions) ? this.pageContent.form.statusOptions : [];
      this.intentOptions = Array.isArray(this.pageContent?.form?.intentOptions) ? this.pageContent.form.intentOptions : [];
      this.interestOptions = Array.isArray(this.pageContent?.form?.interestOptions) ? this.pageContent.form.interestOptions : [];

      if (!this.joinData.intent && this.intentOptions.length > 0) {
        this.joinData.intent = this.intentOptions[0];
      }

      setTimeout(() => this.setupIntersectionObserver(), 100);
    });
  }

  setupIntersectionObserver() {
    const elements = document.querySelectorAll('.fade-up');

    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => this.renderer.addClass(el, 'visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
  }

  onInterestChange(interest: string, event: Event) {
    const target = event.target as HTMLInputElement | null;
    if (!target) {
      return;
    }

    if (target.checked) {
      if (!this.joinData.interests.includes(interest)) {
        this.joinData.interests = [...this.joinData.interests, interest];
      }
      return;
    }

    this.joinData.interests = this.joinData.interests.filter((item) => item !== interest);
  }

  onSubmit() {
    this.isSubmitting = true;
    const message = [
      `Nom: ${this.joinData.lastName} ${this.joinData.firstName}`,
      `Ville: ${this.joinData.city}`,
      `Statut: ${this.joinData.status}`,
      `Intention: ${this.joinData.intent}`,
      `Interets: ${this.joinData.interests.join(', ')}`,
      `Message: ${this.joinData.message}`,
    ].join('\n');

    this.publicService.sendContactMessage({
      name: `${this.joinData.lastName} ${this.joinData.firstName}`.trim(),
      email: this.joinData.email,
      subject: `Nouvelle demande d'adhesion: ${this.joinData.intent}`,
      message,
    }).subscribe({
      next: () => {
        alert('Votre demande a ete envoyee avec succes.');
        this.joinData = {
          lastName: '',
          firstName: '',
          email: '',
          phone: '',
          status: '',
          city: '',
          intent: this.intentOptions[0] || '',
          interests: [],
          message: ''
        };
        this.isSubmitting = false;
      },
      error: () => {
        alert("Une erreur est survenue lors de l'envoi de votre demande.");
        this.isSubmitting = false;
      }
    });
  }
}
