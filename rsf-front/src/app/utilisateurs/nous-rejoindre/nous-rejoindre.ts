import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  joinData = {
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    status: '',
    city: '',
    intent: 'Devenir bénévole',
    interests: [] as string[],
    message: ''
  };
  isSubmitting = false;

  constructor(
    private renderer: Renderer2,
    private publicService: PublicService
  ) {}

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    setTimeout(() => {
      const elements = document.querySelectorAll('.fade-up');
      elements.forEach((el) => observer.observe(el));
    }, 100);
  }

  onInterestChange(interest: string, event: any) {
    if (event.target.checked) {
      this.joinData.interests.push(interest);
    } else {
      this.joinData.interests = this.joinData.interests.filter(i => i !== interest);
    }
  }

  onSubmit() {
    this.isSubmitting = true;
    const message = `
      Nom: ${this.joinData.lastName} ${this.joinData.firstName}
      Ville: ${this.joinData.city}
      Statut: ${this.joinData.status}
      Intention: ${this.joinData.intent}
      Intérêts: ${this.joinData.interests.join(', ')}
      Message: ${this.joinData.message}
    `;

    this.publicService.sendContactMessage({
      name: `${this.joinData.lastName} ${this.joinData.firstName}`,
      email: this.joinData.email,
      subject: `Nouvelle demande d'adhésion: ${this.joinData.intent}`,
      message: message
    }).subscribe({
      next: () => {
        alert('Votre demande a été envoyée avec succès !');
        this.isSubmitting = false;
        // Reset form data
      },
      error: () => {
        alert('Une erreur est survenue lors de l\'envoi de votre demande.');
        this.isSubmitting = false;
      }
    });
  }
}
