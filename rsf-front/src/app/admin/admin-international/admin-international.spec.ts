import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AdminInternational } from './admin-international';

describe('AdminInternational', () => {
  let component: AdminInternational;
  let fixture: ComponentFixture<AdminInternational>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInternational],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminInternational);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
