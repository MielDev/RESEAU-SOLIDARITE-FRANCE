import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-organisation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './organisation.html',
  styleUrl: './organisation.css',
})
export class Organisation implements OnInit {
  pageContent: any = null;
  team: any[] = [];
  president: any = null;
  private observer: IntersectionObserver | null = null;

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.pageContent = data.pageContent ?? null;

      const members = Array.isArray(data.team) ? data.team : [];
      const bgClasses = ['bg-blue', 'bg-purple', 'bg-orange', 'bg-green', 'bg-indigo', 'bg-darkblue', 'bg-mix', 'bg-lightgreen'];
      const presidentCandidate = members.find((member: any) => member.is_president) || null;

      this.team = members
        .filter((member: any) => !member.is_president)
        .map((member: any, index: number) => ({
          ...member,
          bgClass: member.bgClass || bgClasses[index % bgClasses.length]
        }));

      this.president = presidentCandidate;
      if (this.president && typeof this.president.diplomas === 'string') {
        try {
          this.president.diplomas = JSON.parse(this.president.diplomas);
        } catch {
          this.president.diplomas = [];
        }
      } else if (this.president && !Array.isArray(this.president.diplomas)) {
        this.president.diplomas = [];
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

    this.observer?.disconnect();
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
