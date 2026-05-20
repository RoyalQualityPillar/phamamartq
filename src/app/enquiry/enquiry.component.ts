import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MessageDialogComponent } from '../common/message-dialog/message-dialog.component';
import { ApiService } from '../service/api-service/api.service';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SharedModule } from '../common/shared.module';
import { MessageService } from '../service/message.service';


@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.scss'],
 standalone: true,
    imports:[AngularMaterialModule, CommonModule, SharedModule, ReactiveFormsModule]})
export class EnquiryComponent implements OnInit {
  public enquiryForm = new FormGroup({
    packNo: new FormControl(''),
    materialName: new FormControl(''),
    materialCasNo: new FormControl(''),
    packName: new FormControl(''),
    packSize: new FormControl(''),
    noOfPacks: new FormControl(''),
    quantity: new FormControl(''),
    uom: new FormControl(''),
    comments: new FormControl(''),
    email: new FormControl(''),
  });
  constructor(
    public dialogRef: MatDialogRef<EnquiryComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: any,
    public apiService: ApiService,
    public dialog: MatDialog,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.apiService.getEmail().subscribe((data) => {
      this.enquiryForm.get('email').setValue(data);
    });
    this.enquiryForm.patchValue({
      packNo: this.userData.materialInfo.uc0001,
      materialName: this.userData.materialInfo.ff0011,
      materialCasNo: this.userData.materialInfo.ff0013,
      packName: this.userData.materialInfo.ff0001,
      packSize: this.userData.materialInfo.ff0002,
      noOfPacks: this.userData.materialInfo.ff0003,
      quantity: this.userData.materialInfo.ff0004,
      uom: this.userData.materialInfo.ff0005,
      comments: '',
    });
  }

  public submit(): void {
    const data = {
      uc0001: this.userData.materialInfo.uc0001,
      ff0001: this.enquiryForm.get('packNo').value,
      ff0002: this.enquiryForm.get('materialName').value,
      ff0003: this.enquiryForm.get('materialCasNo').value,
      ff0004: this.enquiryForm.get('packName').value,
      ff0005: this.enquiryForm.get('packSize').value,
      ff0006: this.enquiryForm.get('quantity').value,
      ff0007: this.enquiryForm.get('uom').value,
      ff0008: this.enquiryForm.get('email').value,
      ff0009: '',
      ff0010: '',
      ff0011: '',
      ff0012: '',
      unitcode: null,
      createdby: this.userData.materialInfo.createdby,
      status: this.userData.materialInfo.status,
      comments: this.enquiryForm.get('comments').value,
    };
    this.apiService.packMasterSaveUpdate(data).subscribe((data) => {
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
          'ES info Record inserted successfully'
        );
      }
    });
  }
}
