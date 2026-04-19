import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActionsSolidaires } from './admin-actions-solidaires';

describe('AdminActionsSolidaires', () => {
  let component: AdminActionsSolidaires;
  let fixture: ComponentFixture<AdminActionsSolidaires>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminActionsSolidaires],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminActionsSolidaires);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
