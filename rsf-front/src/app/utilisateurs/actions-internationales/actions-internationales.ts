import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-actions-internationales',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './actions-internationales.html',
  styleUrl: './actions-internationales.css',
})
export class ActionsInternationales implements OnInit {
  constructor(private renderer: Renderer2) {}

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
}
