import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AdminAccueil } from './admin-accueil';

describe('AdminAccueil', () => {
  let component: AdminAccueil;
  let fixture: ComponentFixture<AdminAccueil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAccueil],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAccueil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
