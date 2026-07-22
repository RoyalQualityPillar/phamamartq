import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PimpBlogDescriptionComponent } from '../pimp-blog-description/pimp-blog-description.component';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SharedModule } from '../common/shared.module';
import { apiEndPoints } from '../service/api-service/api-endpoints.constant';
import { ApiService } from '../service/api-service/api.service';
import { VerificationComponent } from '../verification/verification.component';
import { EnquiryComponent } from '../enquiry/enquiry.component';
import { CartComponent } from '../cart/cart.component';


export interface userData {
  uc0001: any;
  materialInfo: any;
}
@Component({
  selector: 'app-material-information',
  templateUrl: './material-information.component.html',
  styleUrls: ['./material-information.component.scss'],
  standalone: true,
  imports: [AngularMaterialModule, CommonModule, SharedModule]
})
export class MaterialInformationComponent {
  postDetail = false;
  loginSection: boolean = true;
  registrationSection: boolean = false;
  decodedHtml: string | null = null;
  statusMessage: string = '';
  showPriceQty = true;
  displayPriceQty = false;
  isVerified = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private apiService: ApiService
  ) { }
  ngOnInit(): void {
    this.blogDescription();
  }
  onLoadDescription() {
    const dialogRef = this.dialog.open(PimpBlogDescriptionComponent, {
      minWidth: '80%',
      disableClose: true,
      data: {
        uc0001: this.data.materialInfo[0].uc0001,
        materialInfo: this.data.materialInfo[0]
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.data.ff0006 = result.price;
      // this.apiService.getEmail(this.data.mail);
      this.apiService.validEmail.asObservable().subscribe((data) => {
        if (data) {
          this.showPriceQty = data ? false : true;
          this.displayPriceQty = data ? true : false;
          this.isVerified = data ? true : false;
        }
      });
    });
  }

  public enquiry(element: any) {
    const dialogRef = this.dialog.open(EnquiryComponent, {
      minWidth: '80%',
      disableClose: true,
      data: {
        materialInfo: element,
      },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
  blogDescription() {
    const params = { uc0001: this.data.materialInfo[0].uc0001 };
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

  public cart(element: any): void {
    const dialog = this.dialog.open(VerificationComponent, {
      minWidth: '80%',
      width: '80%',
      disableClose: true,
      data: {
        materialInfo: element,
      },
    });

    dialog.afterClosed().subscribe((result) => { });
  }

  public addToCart(cart: any) {
    const dialog = this.dialog.open(CartComponent, {
      minWidth: '80vw',
      width: '80%',
      disableClose: true,
      data: {
        materialInfo: cart,
      },
    });
  }

  public displayQty(): boolean {
    return (this.showPriceQty = true);
  }
}
