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
  imports: [AngularMaterialModule, CommonModule, SharedModule, ReactiveFormsModule]
})
export class CartSubmissionComponent implements OnInit {
  ViewDetailForm: FormGroup;
  total: any;
  cart: any;
  isPreviousOrder:boolean=false;
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
    this.isPreviousOrder = this.data.isPreviousOrder;
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
    let uc0001 = this.data.data.uc0001;
    let params = { uc0001 };
    const api = this.data.isPreviousOrder ? apiEndPoints.previousCartList : apiEndPoints.cartList
    this.apiService
      .sendRequest(
        api,
        'GET',
        params,
      )
      .subscribe((data: any) => {
        this.cartList = data.data;
        const selectedUc0001 = this.data.data.uc0001;
        this.selectedOrder = this.cartList.find(
          (item: any) => item.sumGroup.uc0001 === selectedUc0001
        );
        if (this.selectedOrder) {
          this.cartRecords = this.selectedOrder.recordList;
          this.ViewDetailForm.patchValue({
            orgUnitCode: this.selectedOrder.sumGroup.ff0011,
            salesUnitCode: this.selectedOrder.sumGroup.ff0012
          });
        }
      });
  }
  public submission(): void {
    const subList = [];
    // this.cartList.forEach((element) => {
    //   subList.push({
    //     uc0001: element.uc0001,
    //     ff0001: element.ff0001,
    //     ff0002: element.ff0002,
    //     ff0003: element.ff0003,
    //     ff0004: element.ff0004,
    //     ff0005: element.ff0005,
    //     ff0006: element.ff0006,
    //     ff0007: element.ff0007,
    //     ff0008: element.ff0008,
    //     ff0009: element.ff0009,
    //     ff0010: element.ff0010,
    //     ff0011: element.ff0011,
    //     ff0012: element.ff0012,
    //     ff0013: element.ff0013,
    //     ff0014: element.ff0014,
    //     ff0015: element.ff0015,
    //     ff0016: element.ff0016,
    //     ff0017: element.ff0017,
    //      unitCode: "PM1",
    //     lc0001: '',
    //     lc0002: '',
    //     lc0003: '',
    //     lc0004: '',
    //     createdby: this.cookieService.get('userId'),
    //     status: 0,
    //     comments: '',
    //   });
    // });
    
     const recordList = this.selectedOrder.recordList.map((item: any) => ({
    uc0001: item.uc0001,
    ff0001: item.ff0001,
    ff0002: item.ff0002,
    ff0003: item.ff0003,
    ff0004: item.ff0004,
    ff0005: item.ff0005,
    ff0006: item.ff0006,
    ff0007: item.ff0007,
    ff0008: item.ff0008,
    ff0009: item.ff0009,
    ff0010: item.ff0010,
    ff0011: item.ff0011,
    ff0012: item.ff0012,
    ff0013: item.ff0013,
    ff0014: item.ff0014,
    ff0015: item.ff0015,
    ff0016: item.ff0016,
    ff0017: item.ff0017,
    unitcode: "PM1",
    lc0001: item.lc0001,
    lc0002: "",
    lc0003: "",
    lc0004: "",
    createdby: this.cookieService.get('userId'),
    status: item.status,
    comments: item.comments
  }));



    const payload = {
      // sumGroup: {
      //   uc0001: '',
      //   unitCode: "PM1",
      //   ff0001: '',
      //   ff0002: '',
      //   ff0003: this.data.totals.ff0012,
      //   ff0004: this.data.totals.ff0013,
      //   ff0005: this.data.totals.ff0014,
      //   ff0006: this.data.totals.ff0015,
      //   ff0007: this.data.totals.ff0016,
      //   ff0008: this.data.totals.ff0017,
      //   ff0009: this.data.totals.ff0017,
      //   ff0010: this.data.totals.ff0017,
      //   ff0011: '',
      //   ff0012: '',
      //   ff0013: '',
      //   ff0014: '',
      //   ff0015: '',
      //   ff0016: '',
      //   ff0017: '',
      //   createdby: this.cookieService.get('userId'),
      //   status: 0,
      //   comments: '',
      // },
       sumGroup: {

      uc0001: this.selectedOrder.sumGroup.uc0001,
      unitCode: "PM1",

      ff0001: this.selectedOrder.sumGroup.ff0001,
      ff0002: this.selectedOrder.sumGroup.ff0002,
      ff0003: this.selectedOrder.sumGroup.ff0003,
      ff0004: this.selectedOrder.sumGroup.ff0004,
      ff0005: this.selectedOrder.sumGroup.ff0005,
      ff0006: this.selectedOrder.sumGroup.ff0006,
      ff0007: this.selectedOrder.sumGroup.ff0007,
      ff0008: this.selectedOrder.sumGroup.ff0008,
      ff0009: this.selectedOrder.sumGroup.ff0009,
      ff0010: this.selectedOrder.sumGroup.ff0010,
      ff0011: this.selectedOrder.sumGroup.ff0011,
      ff0012: this.selectedOrder.sumGroup.ff0012,
      ff0013: this.selectedOrder.sumGroup.ff0013,
      ff0014: this.selectedOrder.sumGroup.ff0014,
      ff0015: this.selectedOrder.sumGroup.ff0015,
      ff0016: this.selectedOrder.sumGroup.ff0016,
      ff0017: this.selectedOrder.sumGroup.ff0017,
      createdby: this.cookieService.get('userId'),
      status: this.selectedOrder.sumGroup.status,
      comments: this.selectedOrder.sumGroup.comments
    },
      recordList: recordList,
    };
    this.apiService.cartSubmission(payload).subscribe((data) => {
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

  removeRowAttachment(row: any) {
    let uc0001 = row.uc0001;
    const params = { uc0001 };
    const HttpMethod = 'POST';
    this.apiService
      .sendRequest(apiEndPoints.cartDelete, HttpMethod, params)
      .subscribe((data: any) => {
        if (data.errorInfo == null) {

          this.selectedOrder.recordList =
            this.selectedOrder.recordList.filter(
              (item: any) => item.uc0001 !== row.uc0001
            );

        } else {

          this.dialog.open(MessageDialogComponent, {
            data: {
              heading: 'Error',
              message: data.errorInfo.message
            }
          });

        }
      });
  }
  // public submission(): void {
  //   let gmail = this.data.gmail;
  //   let params = { gmail };
  //   this.apiService
  //     .sendRequest(
  //       apiEndPoints.cartSubmission,
  //       'POST',
  //       params,
  //     )
  //     .subscribe((data: any) => {
  //       if (data.errorInfo != null) {
  //         this.dialog.open(MessageDialogComponent, {
  //           data: {
  //             message: data.errorInfo.message,
  //             heading: 'Error Information',
  //           },
  //         });
  //       }
  //     });
  // }
}
