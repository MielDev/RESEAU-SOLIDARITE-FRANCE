import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AdminEvenements } from './admin-evenements';

describe('AdminEvenements', () => {
  let component: AdminEvenements;
  let fixture: ComponentFixture<AdminEvenements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEvenements],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEvenements);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
