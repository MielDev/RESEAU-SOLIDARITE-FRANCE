import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSoutien } from './admin-soutien';

describe('AdminSoutien', () => {
  let component: AdminSoutien;
  let fixture: ComponentFixture<AdminSoutien>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSoutien],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSoutien);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
