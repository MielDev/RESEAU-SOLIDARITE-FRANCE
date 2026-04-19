import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Temoignages } from './temoignages';

describe('Temoignages', () => {
  let component: Temoignages;
  let fixture: ComponentFixture<Temoignages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Temoignages],
    }).compileComponents();

    fixture = TestBed.createComponent(Temoignages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
