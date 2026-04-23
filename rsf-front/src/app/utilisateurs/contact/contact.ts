import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  contactData = {
    name: '',
    email: '',
    subject: '',
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

  onSubmit() {
    this.isSubmitting = true;
    this.publicService.sendContactMessage(this.contactData).subscribe({
      next: () => {
        alert('Votre message a été envoyé avec succès !');
        this.contactData = { name: '', email: '', subject: '', message: '' };
        this.isSubmitting = false;
      },
      error: () => {
        alert('Une erreur est survenue lors de l\'envoi du message.');
        this.isSubmitting = false;
      }
    });
  }
}
