import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActualites } from './admin-actualites';

describe('AdminActualites', () => {
  let component: AdminActualites;
  let fixture: ComponentFixture<AdminActualites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminActualites],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminActualites);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
