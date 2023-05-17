import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedEvaluationsComponent } from './detailed-evaluations.component';

describe('DetailedEvaluationsComponent', () => {
  let component: DetailedEvaluationsComponent;
  let fixture: ComponentFixture<DetailedEvaluationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedEvaluationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedEvaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
