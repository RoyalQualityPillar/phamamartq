import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartSubmissionComponent } from './cart-submission.component';

describe('CartSubmissionComponent', () => {
  let component: CartSubmissionComponent;
  let fixture: ComponentFixture<CartSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSubmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
