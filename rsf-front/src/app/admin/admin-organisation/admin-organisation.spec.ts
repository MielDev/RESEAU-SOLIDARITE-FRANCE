import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrganisation } from './admin-organisation';

describe('AdminOrganisation', () => {
  let component: AdminOrganisation;
  let fixture: ComponentFixture<AdminOrganisation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrganisation],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminOrganisation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
