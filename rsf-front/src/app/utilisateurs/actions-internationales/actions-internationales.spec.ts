import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsInternationales } from './actions-internationales';

describe('ActionsInternationales', () => {
  let component: ActionsInternationales;
  let fixture: ComponentFixture<ActionsInternationales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsInternationales],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionsInternationales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
