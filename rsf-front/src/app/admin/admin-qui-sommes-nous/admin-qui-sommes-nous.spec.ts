import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuiSommesNous } from './admin-qui-sommes-nous';

describe('AdminQuiSommesNous', () => {
  let component: AdminQuiSommesNous;
  let fixture: ComponentFixture<AdminQuiSommesNous>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminQuiSommesNous],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminQuiSommesNous);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
