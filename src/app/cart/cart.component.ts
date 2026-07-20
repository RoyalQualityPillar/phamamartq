import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { EnquiryComponent } from '../enquiry/enquiry.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { MessageDialogComponent } from '../common/message-dialog/message-dialog.component';
import { SharedModule } from '../common/shared.module';
import { ApiService } from '../service/api-service/api.service';
import { MessageService } from '../service/message.service';
import { CookieService } from 'ngx-cookie-service';
import { apiEndPoints } from '../service/api-service/api-endpoints.constant';
import { LovDialogComponent } from '../common/lov-dialog/lov-dialog.component';
import { NotificationService } from '../common/notification.service';
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
  unitcode: string;
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
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [AngularMaterialModule, CommonModule, SharedModule, FormsModule, ReactiveFormsModule]
})
export class CartComponent implements OnInit, OnDestroy {
  ViewDetailForm: FormGroup;
  isValueSelected = false;
  gmail: any;
  public totalDisAmt = 0;
  public afterDisAmt = 0;
  public totalAmt = 0;
  public totalGst = 0;
  public SGST: number;
  public CGST: number;
  public IGST: number;
  public materialInfoData: Cart;
  public cartData: any;
  public orgUnitInfo: any;
  public salesUnitInfo: any;
  public enquiryForm = new FormGroup({
    packNo: new FormControl(''),
    materialName: new FormControl(''),
    materialCasNo: new FormControl(''),
    packName: new FormControl(''),
    packSize: new FormControl(''),
    noOfPacks: new FormControl(''),
    quantity: new FormControl(''),
    uom: new FormControl(''),
  });
  constructor(
    public dialogRef: MatDialogRef<EnquiryComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: Cart,
    private apiService: ApiService,
    public fb: FormBuilder,
    private dialog: MatDialog,
    private messageService: MessageService,
    private cookieService: CookieService,
       private notificationService: NotificationService,
  ) {
    this.ViewDetailForm = this.fb.group({
      orgUnitCode: ['', Validators.required],
      salesUnitCode: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.onLoadInputFieldValue();
    this.materialInfoData = this.userData;
    this.enquiryForm.patchValue({
      packNo: this.materialInfoData.materialInfo.uc0001,
      materialName: this.materialInfoData.materialInfo.ff0011,
      materialCasNo: this.materialInfoData.materialInfo.ff0013,
      packName: this.materialInfoData.materialInfo.ff0001,
      packSize: this.materialInfoData.materialInfo.ff0002,
      noOfPacks: this.materialInfoData.materialInfo.ff0003,
      quantity: this.materialInfoData.materialInfo.ff0004,
      uom: this.materialInfoData.materialInfo.ff0005,
    });
    this.apiService
      .getEmail()
      .subscribe((mail: string) => {
        this.gmail = mail;
        if (mail) {

          this.onLoadBUInfo();

        }

      });

    const getDiscount: number = +this.materialInfoData.materialInfo.ff0003;
    const getQuantity: number = +this.materialInfoData.materialInfo.ff0004;
    const getRate: number = +this.materialInfoData.materialInfo.ff0006;
    const getDiscountedAmount: number = getDiscount * getQuantity;
    const getDiscountedRate: number = getRate - getDiscount;
    const getAfterdiscountRate: number =
      getRate * getQuantity - getDiscount * getQuantity;
    const getGstAmount: number =
      (getAfterdiscountRate * +this.materialInfoData.materialInfo.ff0007) / 100;
    const getFinalPrice: number = getAfterdiscountRate + getGstAmount;
    const getDiscountAmount = (getRate * getDiscount) / 100;

    this.materialInfoData.materialInfo['discountedRate'] = getDiscountedRate;
    this.materialInfoData.materialInfo['totalDiscount'] = getDiscountedAmount;
    this.materialInfoData.materialInfo['afterdiscountAmount'] =
      getAfterdiscountRate;
    this.materialInfoData.materialInfo['getGstAmount'] = getGstAmount;
    this.materialInfoData.materialInfo['finalPrice'] = getFinalPrice;
    this.materialInfoData.materialInfo['getDiscountAmount'] = getDiscountAmount;
    let getdiscountedRate = getRate - getDiscount;
    this.totalDisAmt += getdiscountedRate;
    this.afterDisAmt += getAfterdiscountRate;
    this.totalAmt += getFinalPrice;
    this.totalGst += getGstAmount;
  }
  onLoadBUInfo() {
    let gmail = this.gmail;
    let orgCode = 'PM1';
    let params = { orgCode, gmail };
    this.apiService
      .sendRequest(
        apiEndPoints.impBUInfo,
        'GET',
        params,
      )
      .subscribe((data: any) => {
        console.log(data)
        this.cartData = data.data;
        this.setGSTData(this.cartData);
        this.orgUnitInfo = this.cartData[0];
        this.salesUnitInfo = this.cartData[1];

        this.ViewDetailForm.patchValue({
          orgUnitCode: this.orgUnitInfo.uc0001,
          salesUnitCode: this.salesUnitInfo.ff0001
        });
      });
  }
  setGSTData(data) {
    if (data[0].ff0013 == data[1].ff0015) {
      this.CGST = this.totalGst / 2;
      this.SGST = this.totalGst / 2;
      this.IGST = 0;
    } else {
      this.IGST = this.totalGst;
      this.SGST = 0;
      this.CGST = 0;
    }
  }
  salesUnitCode: any;
  paymentTermsCodeList: any;
  isLoading = false;
  orgUnitCode: any;
  onLoadInputFieldValue() {
    this.isLoading = true;
    // this.sdService.getInputValue(this.cookieService.get('buCode')).subscribe((data: any) => {
    let unitCode = this.cookieService.get('buCode');
    let params = { unitCode };
    this.apiService
      .sendRequest(
        apiEndPoints.dropDownSDInputList,
        'GET',
        params,
      )
      .subscribe((data: any) => {
        this.orgUnitCode = data.data.buUnitList;
        this.salesUnitCode = data.data.suUnitList;
        this.paymentTermsCodeList = data.data.paymentTermsMasterList;
        this.isLoading = false;
      });
  }
  unitCodeData: any;
  checkUnitCode() {
    // this.sdService
    //   .getUnitCodeDetail(
    //     this.ViewDetailForm.controls['orgUnitCode'].value,
    //     this.ViewDetailForm.controls['salesUnitCode'].value
    //   )
    let auc0001 = this.ViewDetailForm.controls['orgUnitCode'].value;
    let buc0001 = this.ViewDetailForm.controls['salesUnitCode'].value;
    let pageIndex = 0;
    let size = 5;
    let orgCode = 'PU'
    let params = { auc0001, buc0001, orgCode, pageIndex, size };
    this.apiService
      .sendRequest(
        apiEndPoints.buinfo,
        'POST',
        params,
      )
      .subscribe((data: any) => {
        this.unitCodeData = data.data.content;
        // this.setGSTData(this.unitCodeData);
      });
  }
  isProductInfoSuccess = false;
  onViewDetails() {
    //todo
    if (this.ViewDetailForm.value) {
      if (
        this.ViewDetailForm.controls['orgUnitCode'].value != '' &&
        this.ViewDetailForm.controls['salesUnitCode'].value != ''
      ) {
        this.checkUnitCode();
      }
    }
  }
  public calculateCartValues(): void {
    this.totalDisAmt = null;
    this.afterDisAmt = null;
    this.totalAmt = null;
    this.totalGst = null;

    const getDiscount = this.materialInfoData.materialInfo.ff0003;
    const getQuantity = this.materialInfoData.materialInfo.ff0004;
    const getRate = this.materialInfoData.materialInfo.ff0006;

    const getDiscountedAmount = +getDiscount * +getQuantity;
    const getDiscountedRate = +getRate - +getDiscount;
    const getdiscountedAmount = +getDiscount * +getQuantity;
    const getAfterdiscountRate =
      +getRate * +getQuantity - +getDiscount * +getQuantity;
    const getGstAmount =
      (getAfterdiscountRate * +this.materialInfoData.materialInfo.ff0007) / 100;
    const getFinalPrice = getAfterdiscountRate + getGstAmount;
    const getDiscountAmount = (+getRate * +getDiscount) / 100;

    this.materialInfoData.materialInfo['discountedRate'] = getDiscountedRate;
    this.materialInfoData.materialInfo['totalDiscount'] = getDiscountedAmount;
    this.materialInfoData.materialInfo['afterdiscountAmount'] =
      getAfterdiscountRate;
    this.materialInfoData.materialInfo['getGstAmount'] = getGstAmount;
    this.materialInfoData.materialInfo['finalPrice'] = getFinalPrice;
    this.materialInfoData.materialInfo['getDiscountAmount'] = getDiscountAmount;
    let getdiscountedRate = +getRate - +getDiscount;
    this.totalDisAmt += getdiscountedRate;
    this.afterDisAmt += getAfterdiscountRate;
    this.totalAmt += getFinalPrice;
    this.totalGst += getGstAmount;
  }

  public cartApi(): void {
    const data = {
      sumGroup: {
        uc0001: this.materialInfoData.materialInfo.uc0001,
        unitCode: this.cookieService.get('buCode'),
        ff0001: '',
        ff0002: '',
        ff0003: this.SGST,
        ff0004: this.CGST,
        ff0005: this.IGST,
        ff0006: this.materialInfoData.materialInfo.getGstAmount,
        ff0007: this.materialInfoData.materialInfo.finalPrice,
        ff0008: this.materialInfoData.materialInfo.totalDiscount,
        ff0009: this.materialInfoData.materialInfo.afterdiscountAmount,
        ff0010: 0,
        ff0011: this.orgUnitInfo.uc0001,
        ff0012: this.salesUnitInfo.ff0001,
        ff0013: '',
        ff0014: '',
        ff0015: '',
        ff0016: '',
        ff0017: this.gmail,
        createdby: this.materialInfoData.materialInfo.createdby,
        status: this.materialInfoData.materialInfo.status,
        comments: this.materialInfoData.materialInfo.comments,
      },
      recordList: [
        {
          uc0001: '',
          ff0001: this.materialInfoData.materialInfo.ff0010,
          ff0002: this.materialInfoData.materialInfo.ff0001,
          ff0003: this.materialInfoData.materialInfo.uc0001,
          ff0004: this.materialInfoData.materialInfo.ff0013,
          ff0005: this.materialInfoData.materialInfo.ff0011,
          ff0006: this.materialInfoData.materialInfo.ff0008,
          ff0007: this.materialInfoData.materialInfo.ff0006,
          ff0008: this.materialInfoData.materialInfo.ff0004,
          ff0009: this.materialInfoData.materialInfo.ff0005,
          ff0010: this.materialInfoData.materialInfo.ff0012,
          ff0011: this.materialInfoData.materialInfo.ff0007,
          ff0012: Number(this.materialInfoData.materialInfo.ff0003),
          ff0013: this.materialInfoData.materialInfo.getDiscountAmount,
          ff0014: this.materialInfoData.materialInfo.discountedRate,
          ff0015: this.materialInfoData.materialInfo.totalDiscount,
          ff0016: this.materialInfoData.materialInfo.afterdiscountAmount,
          ff0017: this.materialInfoData.materialInfo.getGstAmount,
          unitCode: this.cookieService.get('buCode'),
          lc0001: '',
          lc0002: '',
          lc0003: '',
          lc0004: '',
          createdby: this.materialInfoData.materialInfo.createdby,
          status: this.materialInfoData.materialInfo.status,
          comments: this.materialInfoData.materialInfo.comments,
        },
      ],
    };

    this.apiService.cartApi(data).subscribe((data) => {
      if (data.errorInfo) {
        this.dialog.open(MessageDialogComponent, {
          data: {
            message: data.errorInfo.message,
            heading: 'Error Information',
          },
        });
      } else {
        this.notificationService.showSuccess(data.status, () => {
          });
          this.dialogRef.close();
      }
    });
  }
  displayedColumns: any;
  selectedDialogData: any;
  openOrgUnitCodeLov() {
    this.displayedColumns = [
      { field: 'buunitcode', title: 'Code' },
      { field: 'buunitname', title: 'Description' },
    ];
    const dialogRef = this.dialog.open(LovDialogComponent, {
      height: '500px',
      width: '600px',
      data: {
        dialogTitle: 'Organization Unit Code',
        dialogColumns: this.displayedColumns,
        dialogData: this.orgUnitCode,
        lovName: 'businessUnitList',
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedDialogData = result.data;
        this.isValueSelected = true;
        this.ViewDetailForm.controls['orgUnitCode'].setValue(
          result.data.buunitcode
        );
        this.onViewDetails();
      }
    });
  }
  isPlantCodeSuccess: boolean;
  onChangeOrgUnitCode() {
    if (this.ViewDetailForm.controls['orgUnitCode'].value == '') {
      this.ViewDetailForm.controls['orgUnitCode'].setValue('');
    } else {
      let currentPlantCodeValue =
        this.ViewDetailForm.controls['orgUnitCode'].value;
      this.isPlantCodeSuccess = false;
      this.orgUnitCode.forEach((elements) => {
        if (elements.buunitcode == currentPlantCodeValue) {
          this.isPlantCodeSuccess = true;
          this.onViewDetails();
        }
      });
      if (this.isPlantCodeSuccess == false) {
        this.ViewDetailForm.controls['orgUnitCode'].setErrors({
          incorrect: true,
        });
        this.openOrgUnitCodeLov();
      }
    }
  }
  openSalesUnitLov() {
    this.displayedColumns = [
      { field: 'suunitcode', title: 'Code' },
      { field: 'suunitname', title: 'Description' },
    ];
    const dialogRef = this.dialog.open(LovDialogComponent, {
      height: '500px',
      width: '600px',
      data: {
        dialogTitle: 'Sales Unit Code',
        dialogColumns: this.displayedColumns,
        dialogData: this.salesUnitCode,
        lovName: 'businessUnitList',
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedDialogData = result.data;
        // this.isValueSelected=true;
        this.ViewDetailForm.controls['salesUnitCode'].setValue(
          result.data.suunitcode
        );
        this.onViewDetails();
      }
    });
  }
  onChangeSalesUnitCode() {
    if (this.ViewDetailForm.controls['salesUnitCode'].value == '') {
      this.ViewDetailForm.controls['salesUnitCode'].setValue('');
    } else {
      let currentPlantCodeValue =
        this.ViewDetailForm.controls['salesUnitCode'].value;
      this.isPlantCodeSuccess = false;
      this.orgUnitCode.forEach((elements) => {
        if (elements.suunitcode == currentPlantCodeValue) {
          this.isPlantCodeSuccess = true;
          this.onViewDetails();
        }
      });
      if (this.isPlantCodeSuccess == false) {
        this.ViewDetailForm.controls['salesUnitCode'].setErrors({
          incorrect: true,
        });
        this.openSalesUnitLov();
      }
    }
  }

  ngOnDestroy(): void {
    delete this.materialInfoData.materialInfo;
    delete this.userData.materialInfo;
  }
}
