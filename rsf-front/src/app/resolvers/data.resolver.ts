import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PublicService } from '../services/public.service';
import { forkJoin } from 'rxjs';

export const accueilResolver: ResolveFn<any> = () => {
  const publicService = inject(PublicService);
  return forkJoin({
    pageContent: publicService.getPageContent('accueil'),
    testimonials: publicService.getTestimonials(),
    actualities: publicService.getActualities()
  });
};

export const settingsResolver: ResolveFn<any> = () => {
  const publicService = inject(PublicService);
  return forkJoin({
    settings: publicService.getSettings(),
    nav: publicService.getNav()
  });
};

export const pageResolver: ResolveFn<any> = (route) => {
  const publicService = inject(PublicService);
  const pageKey = route.data['pageKey'];
  return publicService.getPageContent(pageKey);
};

export const listResolver: ResolveFn<any[]> = (route) => {
  const publicService = inject(PublicService);
  const listType = route.data['listType'];
  switch (listType) {
    case 'testimonials': return publicService.getTestimonials();
    case 'actualities': return publicService.getActualities();
    case 'events': return publicService.getEvents();
    case 'missions': return publicService.getMissions();
    case 'team': return publicService.getTeam();
    default: return [];
  }
};
