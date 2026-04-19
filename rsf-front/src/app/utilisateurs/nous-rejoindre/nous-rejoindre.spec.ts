import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NousRejoindre } from './nous-rejoindre';

describe('NousRejoindre', () => {
  let component: NousRejoindre;
  let fixture: ComponentFixture<NousRejoindre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NousRejoindre],
    }).compileComponents();

    fixture = TestBed.createComponent(NousRejoindre);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
