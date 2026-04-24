import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AdminDon } from './admin-don';

describe('AdminDon', () => {
  let component: AdminDon;
  let fixture: ComponentFixture<AdminDon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDon],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
