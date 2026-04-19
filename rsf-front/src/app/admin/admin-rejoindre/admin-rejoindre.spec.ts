import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRejoindre } from './admin-rejoindre';

describe('AdminRejoindre', () => {
  let component: AdminRejoindre;
  let fixture: ComponentFixture<AdminRejoindre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRejoindre],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRejoindre);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
