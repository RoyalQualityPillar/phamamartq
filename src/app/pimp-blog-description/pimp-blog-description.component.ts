import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { PrintConfirmationComponent } from '../print-confirmation/print-confirmation.component';
import { AdminService } from '../service/admin.service';
import { apiEndPoints } from '../service/api-service/api-endpoints.constant';
import { ApiService } from '../service/api-service/api.service';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SharedModule } from '../common/shared.module';

export interface userData {
  uc0001: any;
}

@Component({
    selector: 'app-pimp-blog-description',
    templateUrl: './pimp-blog-description.component.html',
    styleUrls: ['./pimp-blog-description.component.scss'],
     standalone: true,
    imports:[AngularMaterialModule, CommonModule, SharedModule, ReactiveFormsModule]
})
export class PimpBlogDescriptionComponent {
  detailConfirmation: FormGroup;
  RegistrationForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private cookieService: CookieService,
    private authService: AuthService,
    //private dmsService: DmsService,
    private adminService: AdminService,
    public dialogRef: MatDialogRef<PrintConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: userData,
    private apiService: ApiService,
    public dialog: MatDialog
  ) {
    this.detailConfirmation = this.fb.group({
      mailId: ['', Validators.required],
      otp: [''],
      email: [''],
      mobile: [''],
    });
    this.RegistrationForm = this.fb.group({
      uc0001: [''],
      ff0001: [''],
      ff0002: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+')]],
      ff0003: ['', Validators.pattern('[a-zA-Z][a-zA-Z ]+')],
      ff0004: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      ff0005: ['', [Validators.required, Validators.email]],
      ff0006: ['', Validators.required],
      ff0007: ['', Validators.required],
      ff0008: [''],
      ff0009: [''],
      ff0010: [''],
      ff0011: [''],
      ff0012: [''],
      unitcode: [''],
      createdby: [''],
      status: [''],
      comments: [''],
    });
  }
  ngOnInit(): void {
  }
  responseMsg: any;
  isErrorMsg: boolean = false;
  isSuccessMsg: boolean = false;
  successMsg: any;
  errorMsg: any;
  loginSection: boolean = true;
  registrationSection: boolean = false;
  isLoading = false;
  postDetail = false;
  senConfirmation() {
    this.isLoading = true;
    this.isErrorMsg = false;
    this.isSuccessMsg = false;
    let  mailId = this.detailConfirmation.controls['mailId'].value
    const params = { mailId };
    const HttpMethod = 'POST';

    this.apiService
      .sendRequest(apiEndPoints.pimrVerification, HttpMethod, params)
      .subscribe((response: any) => {
        this.apiService.validEmail.next('validEmail');
        this.isLoading = false;
        if (response?.status) {
          this.apiService.setEmail(mailId);
          this.isErrorMsg = false;
          this.isSuccessMsg = true;
          this.successMsg = response?.status;
        } else {
          this.isErrorMsg = true;
          this.isSuccessMsg = false;
          this.errorMsg = response?.errorInfo?.message;
        }
      });
  }
  otpVerify() {
    const params = {
      ff0005: this.detailConfirmation.controls['mailId'].value,
      inputCode: this.detailConfirmation.controls['otp'].value,
      csCode:'C'
    };
    const HttpMethod = 'POST';

    this.apiService
      .sendRequest(apiEndPoints.pimrvalidationCode, HttpMethod, params)
      .subscribe((response: any) => {
        console.log(response);
        if (response?.status) {
          // Extract the price from the response if available
          const price = response.data?.price || null;

          // Close the dialog and pass the price back to the parent component
          this.dialogRef.close({ price });
        }
      });
  }
  decodedHtml: string | null = null;
  statusMessage: string = '';

  blogDescription() {
    const params = { uc0001: this.userData.uc0001 };
    const HttpMethod = 'GET';

    this.apiService
      .sendRequest(apiEndPoints.blogRecord, HttpMethod, params)
      .subscribe(
        (response: any) => {
          this.postDetail = true;
          this.loginSection = false;
          this.registrationSection = false;

          if (response.data) {
            // Check if the Base64 content is an image or text
            if (isImageBase64(response.data)) {
              this.decodedHtml = `<img src="data:image/png;base64,${response.data}" alt="Image" />`;
            } else {
              try {
                const byteCharacters = atob(response.data);
                const byteArray = new Uint8Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteArray[i] = byteCharacters.charCodeAt(i);
                }
                this.decodedHtml = new TextDecoder('utf-8').decode(byteArray);

                // Apply conditional styling for Telugu content
                const isTelugu = /[\u0C00-\u0C7F]/.test(this.decodedHtml);
                if (isTelugu) {
                  this.decodedHtml = `<div class="telugu-text">${this.decodedHtml}</div>`;
                }
              } catch (error) {
                console.error('Error decoding multilingual content', error);
                this.decodedHtml = 'Content could not be displayed.';
              }
            }
          }

          this.statusMessage = response.status || '';
        },
        (error: any) => {
          console.error('API call failed', error);
          this.statusMessage =
            'Failed to load blog details. Please try again later.';
        }
      );

    // Helper function to check if the Base64 data is an image
    function isImageBase64(data: string): boolean {
      return (
        data.startsWith('/') || // PNG signature
        data.startsWith('iVBORw0KGgo') || // PNG signature
        data.startsWith('/9j/') || // JPEG signature
        data.startsWith('R0lGODlh') // GIF signature
      );
    }
  }

  registrationSuccessMsg: any;
  onRegistration() {
    this.isLoading = true;
    const params = {};
    const HttpMethod = 'POST';
    this.RegistrationForm.controls['uc0001'].setValue('SP1');
    this.apiService
      .sendRequest(
        apiEndPoints.blgRegistration,
        HttpMethod,
        params,
        this.RegistrationForm.value
      )
      .subscribe((response: any) => {
        console.log(response);
        this.isLoading = false;
        if (response?.status) {
           const mail = response.data?.ff0005 || null;
           this.apiService.setEmail(mail);
          this.loginSection = true;
          this.registrationSection = false;
          this.registrationSuccessMsg =
            'Registration Successfully completed ! Please login to view blog.';
        } else {
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
  backToLogin() {
    this.postDetail = false;
    this.loginSection = true;
    this.registrationSection = false;
    this.isErrorMsg = false;
    this.isSuccessMsg = false;
  }
}
