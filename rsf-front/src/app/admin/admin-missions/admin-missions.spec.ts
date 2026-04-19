import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMissions } from './admin-missions';

describe('AdminMissions', () => {
  let component: AdminMissions;
  let fixture: ComponentFixture<AdminMissions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMissions],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMissions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
