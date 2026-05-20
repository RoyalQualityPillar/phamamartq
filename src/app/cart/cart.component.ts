import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { EnquiryComponent } from '../enquiry/enquiry.component';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { MessageDialogComponent } from '../common/message-dialog/message-dialog.component';
import { SharedModule } from '../common/shared.module';
import { ApiService } from '../service/api-service/api.service';
import { MessageService } from '../service/message.service';
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
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
    imports:[AngularMaterialModule, CommonModule, SharedModule, FormsModule]})
export class CartComponent implements OnInit, OnDestroy {
  public totalDisAmt = 0;
  public afterDisAmt = 0;
  public totalAmt = 0;
  public totalGst = 0;
  public SGST: number;
  public CGST: number;
  public IGST: number;
  public materialInfoData: Cart;
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
    private dialog: MatDialog,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    console.log(this.userData);
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
        ff0001: this.materialInfoData.materialInfo.totalDiscount,
        ff0002: this.materialInfoData.materialInfo.afterdiscountAmount,
        ff0003: this.SGST,
        ff0004: this.CGST,
        ff0005: this.IGST,
        ff0006: this.materialInfoData.materialInfo.getGstAmount,
        ff0007: this.materialInfoData.materialInfo.finalPrice,
        ff0008: 0,
        ff0009: 0,
        ff0010: 0,
        ff0011: '',
        ff0012: '',
        ff0013: '',
        ff0014: '',
        ff0015: '',
        ff0016: '',
        ff0017: '',
        createdby: this.materialInfoData.materialInfo.createdby,
        status: this.materialInfoData.materialInfo.status,
        comments: this.materialInfoData.materialInfo.comments,
      },
      recordList: [
        {
          uc0001: '',
          ff0001: this.materialInfoData.materialInfo.ff0005,
          ff0002: this.materialInfoData.materialInfo.ff0001,
          ff0003: this.materialInfoData.materialInfo.uc0001,
          ff0004: this.materialInfoData.materialInfo.ff0013,
          ff0005: this.materialInfoData.materialInfo.ff0011,
          ff0006: this.materialInfoData.materialInfo.ff0010,
          ff0007: this.materialInfoData.materialInfo.ff0006,
          ff0008: this.materialInfoData.materialInfo.ff0004,
          ff0009: this.materialInfoData.materialInfo.ff0005,
          ff0010: this.materialInfoData.materialInfo.ff0003,
          ff0011: this.materialInfoData.materialInfo.ff0011,
          ff0012: this.materialInfoData.materialInfo.ff0003,
          ff0013: this.materialInfoData.materialInfo.getDiscountAmount,
          ff0014: this.materialInfoData.materialInfo.discountedRate,
          ff0015: this.materialInfoData.materialInfo.totalDiscount,
          ff0016: this.materialInfoData.materialInfo.afterdiscountAmount,
          ff0017: this.materialInfoData.materialInfo.getGstAmount,
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
        this.messageService.sendSnackbar(
          'success',
          'Cart info Record inserted successfully'
        );
      }
    });
  }

  ngOnDestroy(): void {
    delete this.materialInfoData.materialInfo;
    delete this.userData.materialInfo;
  }
}
