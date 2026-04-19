import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RencontreAnnuelle } from './rencontre-annuelle';

describe('RencontreAnnuelle', () => {
  let component: RencontreAnnuelle;
  let fixture: ComponentFixture<RencontreAnnuelle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RencontreAnnuelle],
    }).compileComponents();

    fixture = TestBed.createComponent(RencontreAnnuelle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
