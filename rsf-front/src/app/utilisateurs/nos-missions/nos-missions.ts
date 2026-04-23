import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nos-missions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nos-missions.html',
  styleUrl: './nos-missions.css',
})
export class NosMissions implements OnInit {
  pageContent: any = null;
  missions: any[] = [];

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.pageContent = data.pageContent ?? null;
      const missions = Array.isArray(data.missions) ? data.missions : [];

      this.missions = missions.map((mission: any) => ({
        ...mission,
        cardClass: mission.cardClass || `card-${mission.color_name || 'primary'}`,
        iconBoxClass: mission.iconBoxClass || `box-${mission.color_name || 'primary'}`,
        points: Array.isArray(mission.points)
          ? mission.points
          : Array.isArray(mission.items)
            ? mission.items.map((item: any) => typeof item === 'string' ? item : item?.text).filter(Boolean)
            : []
      }));

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
}
