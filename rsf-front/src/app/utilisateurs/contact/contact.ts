import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PublicService } from '../../services/public.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit {
  pageContent: any = null;
  settings: any = null;
  subjectOptions: string[] = [];
  contactData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  isSubmitting = false;

  constructor(
    private renderer: Renderer2,
    private publicService: PublicService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.settings = this.route.parent?.snapshot.data['data']?.settings ?? null;

    this.route.data.subscribe((data: any) => {
      this.pageContent = data.pageContent ?? null;
      this.subjectOptions = Array.isArray(this.pageContent?.details?.subjectOptions)
        ? this.pageContent.details.subjectOptions
        : [];

      if (!this.contactData.subject && this.subjectOptions.length > 0) {
        this.contactData.subject = this.subjectOptions[0];
      }

      setTimeout(() => this.setupIntersectionObserver(), 100);
    });
  }

  getAddressLines(): string[] {
    const lines = [
      this.settings?.addr_street,
      [this.settings?.addr_city, this.settings?.addr_country].filter(Boolean).join(', ')
    ].filter(Boolean);

    if (lines.length > 0) {
      return lines;
    }

    return this.settings?.address ? [this.settings.address] : [];
  }

  getWebsiteLabel(): string {
    const website = this.settings?.contact_web || '';
    return website.replace(/^https?:\/\//i, '').replace(/\/$/, '');
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

  onSubmit() {
    this.isSubmitting = true;
    this.publicService.sendContactMessage(this.contactData).subscribe({
      next: () => {
        alert('Votre message a ete envoye avec succes.');
        this.contactData = {
          name: '',
          email: '',
          subject: this.subjectOptions[0] || '',
          message: ''
        };
        this.isSubmitting = false;
      },
      error: () => {
        alert("Une erreur est survenue lors de l'envoi du message.");
        this.isSubmitting = false;
      }
    });
  }
}
