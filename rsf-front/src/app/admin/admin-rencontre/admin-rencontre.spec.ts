import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRencontre } from './admin-rencontre';

describe('AdminRencontre', () => {
  let component: AdminRencontre;
  let fixture: ComponentFixture<AdminRencontre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRencontre],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRencontre);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
