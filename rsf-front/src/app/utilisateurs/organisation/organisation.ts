import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PublicService } from '../../services/public.service';

@Component({
  selector: 'app-organisation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './organisation.html',
  styleUrl: './organisation.css',
})
export class Organisation implements OnInit {
  team: any[] = [];
  president: any = null;
  pageContent: any = null;
  private observer: IntersectionObserver | null = null;

  constructor(
    private renderer: Renderer2,
    private publicService: PublicService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.pageContent = data.pageContent;
      if (data.team) {
        const bgClasses = ['bg-blue', 'bg-purple', 'bg-orange', 'bg-green', 'bg-indigo', 'bg-darkblue', 'bg-mix', 'bg-lightgreen'];
        
        this.team = data.team
          .filter((m: any) => !m.is_president)
          .map((m: any, index: number) => ({
            ...m,
            bgClass: m.bgClass || bgClasses[index % bgClasses.length]
          }));
          
        this.president = data.team.find((m: any) => m.is_president);
        if (this.president && typeof this.president.diplomas === 'string') {
          try {
            this.president.diplomas = JSON.parse(this.president.diplomas);
          } catch (e) {
            console.error('Error parsing diplomas:', e);
            this.president.diplomas = [];
          }
        }
        setTimeout(() => this.setupIntersectionObserver(), 100);
      }
    });
  }

  setupIntersectionObserver() {
    const elements = document.querySelectorAll('.fade-up');
    
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => this.renderer.addClass(el, 'visible'));
      return;
    }

    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => this.observer?.observe(el));
  }
}
