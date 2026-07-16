import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../service/api-service/api.service';
import { MessageDialogComponent } from '../common/message-dialog/message-dialog.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../common/shared.module';
import { apiEndPoints } from '../service/api-service/api-endpoints.constant';

@Component({
  selector: 'app-cart-submission',
  templateUrl: './cart-submission.component.html',
  styleUrl: './cart-submission.component.scss',
  standalone: true,
  imports:[AngularMaterialModule, CommonModule, SharedModule, ReactiveFormsModule]
})
export class CartSubmissionComponent implements OnInit {
  ViewDetailForm: FormGroup;
  total: any;
  cart: any;
    public orgUnitInfo: any;
  public salesUnitInfo: any;
  public cartList: any[] = [];
  public selectedOrder: any = null; 
public cartRecords: any[] = []; 
  qtListDisplayColumn: string[] = [
    'ff0005',
    'ff0006',
    'ff0018',
    'ff0007',
    'ff0009',
    'ff0010',
    'ff0011',
    'ff0012',
    'ff0019',
    'ff0013',
    'ff0015',
    'ff0016',
    'ff0017',
  ];
  public totals: any = {
    ff0012: 0,
    ff0013: 0,
    ff0014: 0,
    ff0015: 0,
    ff0016: 0,
    ff0017: 0,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private form: FormBuilder,
    private apiService: ApiService,
    public dialog: MatDialog,
    private cookieService: CookieService
  ) {
    this.ViewDetailForm = this.form.group({
      orgUnitCode: ['', Validators.required],
      salesUnitCode: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log(this.data);
    console.log(this.data.venInfo);
     this.orgUnitInfo = this.data.venInfo.venInfo[0];
        this.salesUnitInfo = this.data.venInfo.venInfo[1];
    this.onLoadCartList();
  }

  public changeOrgUnit(): void {
    const { orgUnitCode } = this.ViewDetailForm.controls;

    if (orgUnitCode.value) {
      this.apiService.curtList(orgUnitCode.value).subscribe(({ data }) => {
        if (data) {
          this.cart = data;
          data.forEach((element) => {
            this.totals.ff0012 += +element.ff0012;
            this.totals.ff0013 += +element.ff0013;
            this.totals.ff0014 += +element.ff0014;
            this.totals.ff0015 += +element.ff0015;
            this.totals.ff0016 += +element.ff0016;
            this.totals.ff0017 += +element.ff0017;
          });
        }
      });
    }
  }
onLoadCartList() {
    let gmail = this.data.gmail;
    let params = { gmail };
    this.apiService
      .sendRequest(
        apiEndPoints.cartList,
        'GET',
        params,
      )
      .subscribe((data: any) => {
        console.log(data)
        this.cartList = data.data;
        this.selectedOrder = this.cartList[0];
         this.cartRecords = this.selectedOrder.recordList;
        this.ViewDetailForm.patchValue({
          orgUnitCode: this.selectedOrder.sumGroup.ff0011,
          salesUnitCode: this.selectedOrder.sumGroup.ff0012
        });
      });
    }
  // public submission(): void {
  //   const subList = [];
  //   this.cartList.forEach((element) => {
  //     subList.push({
  //       uc0001: element.uc0001,
  //       ff0001: element.ff0001,
  //       ff0002: element.ff0002,
  //       ff0003: element.ff0003,
  //       ff0004: element.ff0004,
  //       ff0005: element.ff0005,
  //       ff0006: element.ff0006,
  //       ff0007: element.ff0007,
  //       ff0008: element.ff0008,
  //       ff0009: element.ff0009,
  //       ff0010: element.ff0010,
  //       ff0011: element.ff0011,
  //       ff0012: element.ff0012,
  //       ff0013: element.ff0013,
  //       ff0014: element.ff0014,
  //       ff0015: element.ff0015,
  //       ff0016: element.ff0016,
  //       ff0017: element.ff0017,
  //       lc0001: '',
  //       lc0002: '',
  //       lc0003: '',
  //       lc0004: '',
  //       createdby: this.cookieService.get('userId'),
  //       status: 0,
  //       comments: '',
  //     });
  //   });
  //   const payload = {
  //     sumsubGroup: {
  //       uc0001: '',
  //       unitCode: "PM1",
  //       ff0001: '',
  //       ff0002: '',
  //       ff0003: this.data.totals.ff0012,
  //       ff0004: this.data.totals.ff0013,
  //       ff0005: this.data.totals.ff0014,
  //       ff0006: this.data.totals.ff0015,
  //       ff0007: this.data.totals.ff0016,
  //       ff0008: this.data.totals.ff0017,
  //       ff0009: this.data.totals.ff0017,
  //       ff0010: this.data.totals.ff0017,
  //       ff0011: '',
  //       ff0012: '',
  //       ff0013: '',
  //       ff0014: '',
  //       ff0015: '',
  //       ff0016: '',
  //       ff0017: '',
  //       createdby: this.cookieService.get('userId'),
  //       status: 0,
  //       comments: '',
  //     },
  //     recordsubList: subList,
  //   };

  //   this.apiService.cartSubmission(payload).subscribe((data) => {
  //     if (data.errorInfo != null) {
  //       this.dialog.open(MessageDialogComponent, {
  //         data: {
  //           message: data.errorInfo.message,
  //           heading: 'Error Information',
  //         },
  //       });
  //     }
  //   });
  // }


   public submission(): void {
     let gmail = this.data.gmail;
    let params = { gmail };
    this.apiService
      .sendRequest(
        apiEndPoints.cartSubmission,
        'POST',
        params,
      )
      .subscribe((data: any) => {
      if (data.errorInfo != null) {
        this.dialog.open(MessageDialogComponent, {
          data: {
            message: data.errorInfo.message,
            heading: 'Error Information',
          },
        });
      }
    });
  }
}
