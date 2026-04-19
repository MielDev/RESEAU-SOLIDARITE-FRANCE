import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsSolidaires } from './actions-solidaires';

describe('ActionsSolidaires', () => {
  let component: ActionsSolidaires;
  let fixture: ComponentFixture<ActionsSolidaires>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsSolidaires],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionsSolidaires);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
