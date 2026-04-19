import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTemoignages } from './admin-temoignages';

describe('AdminTemoignages', () => {
  let component: AdminTemoignages;
  let fixture: ComponentFixture<AdminTemoignages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTemoignages],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTemoignages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
