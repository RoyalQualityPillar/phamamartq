import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CartComponent } from '../cart/cart.component';

import { CookieService } from 'ngx-cookie-service';
import { PrintConfirmationComponent } from '../print-confirmation/print-confirmation.component';
import { apiEndPoints } from '../service/api-service/api-endpoints.constant';
import { ApiService } from '../service/api-service/api.service';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SharedModule } from '../common/shared.module';
export interface Cart {
  materialInfo: Pack;
}
export interface Pack {
  id: number;
  uc0001: 'SP1P002';
  ff0001: 'Bag';
  ff0002: string;
  ff0003: string;
  ff0004: string;
  ff0005: string;
  ff0006: string;
  ff0007: string;
  ff0008: string;
  ff0009: string;
  ff0010: string;
  ff0011: string;
  ff0012: string;
  ff0013: string;
  unitCode: string;
  createdby: string;
  createdon: string;
  status: number;
  version: number;
  comments: string;
  discountedRate: number;
  totalDiscount: number;
  afterdiscountAmount: number;
  getGstAmount: number;
  finalPrice: number;
  getDiscountAmount: number;
}

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.scss',
 standalone: true,
    imports:[AngularMaterialModule, CommonModule, SharedModule, ReactiveFormsModule]})
export class VerificationComponent {
  loginSection: boolean = true;
  registrationSection: boolean = false;
  postDetail = false;
  isLoading = false;
  isErrorMsg: boolean = false;
  isSuccessMsg: boolean = false;
  successMsg: any;
  errorMsg: any;
  public detailConfirmation = new FormGroup({
    userId: new FormControl(),
    otp:new FormControl(),
  });

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PrintConfirmationComponent>,
    private cookieService: CookieService,
    @Inject(MAT_DIALOG_DATA) public userData: Cart
  ) {}

  public sendConfirmation(): void {
    this.isLoading = true;
    this.isErrorMsg = false;
    this.isSuccessMsg = false;
    this.apiService
      .verification(this.detailConfirmation.get('userId').value)
      .subscribe((data) => {
        if (data?.status) {
          this.isErrorMsg = false;
          this.isSuccessMsg = true;
          this.successMsg = data?.status;

        
        } else {
          this.isErrorMsg = true;
          this.isSuccessMsg = false;
          this.errorMsg = data?.errorInfo?.message;
        }
      });
  }
  onDisplayRegistrationForm() {
    this.postDetail = false;
    this.loginSection = false;
    this.registrationSection = true;
    this.isErrorMsg = false;
    this.isSuccessMsg = false;
  }
  otpVerify() {
      const params = {
        unitCode: "PM1",
        inputCode: this.detailConfirmation.controls['otp'].value,
      };
      const HttpMethod = 'POST';
  
      this.apiService
        .sendRequest(apiEndPoints.cartValidationCode, HttpMethod, params)
        .subscribe((response: any) => {
          if (response?.status) {
            // Extract the price from the response if available
            const price = response.data?.price || null;
  
            // Close the dialog and pass the price back to the parent component
            this.dialogRef.close({ price });
          }
          const dialogRef = this.dialog.open(CartComponent, {
            minWidth: '80%',
            disableClose: true,
            data: {
              materialInfo: this.userData.materialInfo,
            },
          });

          dialogRef.afterClosed().subscribe((data) => {
            
          });
        });
    }
}
