import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordExpireConfirmationDialogComponent } from './password-expire-confirmation-dialog.component';

describe('PasswordExpireConfirmationDialogComponent', () => {
  let component: PasswordExpireConfirmationDialogComponent;
  let fixture: ComponentFixture<PasswordExpireConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordExpireConfirmationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordExpireConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
