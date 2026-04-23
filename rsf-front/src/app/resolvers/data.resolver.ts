import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { PublicService } from '../services/public.service';

export const pageResolver: ResolveFn<any> = (route) => {
  const publicService = inject(PublicService);
  return publicService.getPageContent(route.data['pageKey']);
};

export const settingsResolver: ResolveFn<any> = () => {
  const publicService = inject(PublicService);
  return forkJoin({
    settings: publicService.getSettings(),
    nav: publicService.getNav(),
  });
};

export const listResolver: ResolveFn<any[]> = (route) => {
  const publicService = inject(PublicService);
  const listType = route.data['listType'];

  switch (listType) {
    case 'testimonials':
      return publicService.getTestimonials();
    case 'actualities':
      return publicService.getActualities();
    case 'events':
      return publicService.getEvents();
    case 'missions':
      return publicService.getMissions();
    case 'team':
      return publicService.getTeam();
    case 'actions':
      return publicService.getActions(route.data['actionPageType']);
    case 'donModes':
      return publicService.getDonModes();
    default:
      return of([]);
  }
};
