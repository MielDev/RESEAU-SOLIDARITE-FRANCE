import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NosMissions } from './nos-missions';

describe('NosMissions', () => {
  let component: NosMissions;
  let fixture: ComponentFixture<NosMissions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NosMissions],
    }).compileComponents();

    fixture = TestBed.createComponent(NosMissions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
