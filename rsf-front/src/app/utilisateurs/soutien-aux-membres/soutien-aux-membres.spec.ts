import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoutienAuxMembres } from './soutien-aux-membres';

describe('SoutienAuxMembres', () => {
  let component: SoutienAuxMembres;
  let fixture: ComponentFixture<SoutienAuxMembres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoutienAuxMembres],
    }).compileComponents();

    fixture = TestBed.createComponent(SoutienAuxMembres);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
