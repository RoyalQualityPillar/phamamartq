import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { apiEndPoints } from '../service/api-service/api-endpoints.constant';
import { ApiService } from '../service/api-service/api.service';
import { CommonService } from '../service/common.service';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../common/shared.module';
import { LovDialogComponent } from '../common/lov-dialog/lov-dialog.component';
export interface userData {
  tableData:any;
}
@Component({
    selector: 'app-print-confirmation',
    templateUrl: './print-confirmation.component.html',
    styleUrls: ['./print-confirmation.component.scss'],
    standalone: false,
    // imports: [AngularMaterialModule, CommonModule, SharedModule]
})

export class PrintConfirmationComponent {

  ConfirmPrint:FormGroup;
  isReadonly:boolean;
  isLoading:boolean;
  isSuccess:boolean;
  isCopyTypeValueSuccess = false;
  selectedDialogData: any;
  displayedColumns: any;
  ptyList: any[] = [];
  deptCodeList: any;
  isDepCodeSuccess: any;
  constructor( 
    private fb:FormBuilder,
    private cookiesService:CookieService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<PrintConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: userData,
    private apiService: ApiService,
    public dialog: MatDialog,){
   this.ConfirmPrint=this.fb.group({
    ff0007:['',Validators.required],
    printerName:['',Validators.required],
    comments:['',Validators.required],
    copyType:['',Validators.required],
    department:['',Validators.required]
   })
  }
  ngOnInit(): void {
    console.log(this.userData.tableData)
    this.isReadonly=true;
    let userID=this.cookiesService.get('userId')
    //console.log(userID)
     //this.EsignatureForm.controls['userId'].setValue(userID)
     this.onLoadDropDown();
     this.onLoadDepartDropDown();
  }
  onLoadDropDown() {
    this.commonService.getDMSDropDownList().subscribe((data: any) => {
      console.log(data);
      this.ptyList = data.data.ptyList;
    });
  }
  onLoadDepartDropDown() {
    this.commonService.getDropDownList().subscribe((data: any) => {
      console.log(data);
      this.deptCodeList = data.data.deptCodeList;    
    });
  }

  onConfirm(){
    let ff0001=this.userData.tableData.lc0002;
    let ff0002 =this.userData.tableData.lc0001;
    let uc0001 =this.userData.tableData.uc0001
    let params = {ff0001,ff0002,uc0001}
    let body ={
      uc0001:this.userData.tableData.uc0001,
      ff0003:this.ConfirmPrint.controls['copyType'].value,
      ff0004:this.ConfirmPrint.controls['printerName'].value,
      ff0005:this.ConfirmPrint.controls['department'].value,
      comments:this.ConfirmPrint.controls['comments'].value,
      ff0007:this.ConfirmPrint.controls['ff0007'].value,
      ff0001:this.userData.tableData.lc0002,
    }
    
    this.apiService.sendRequest(apiEndPoints.matsterDocumentDirectPrint,'POST',params,body).subscribe((data)=>{
      console.log(data);
      if(data){
      let fileExtension = 'pdf';
      const binaryData = atob(data.data);
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }
      let blob: any;
      blob = new Blob([uint8Array], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = ff0001 + '.' + fileExtension;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      this.isSuccess=true;
      this.dialogRef.close({data:this.isSuccess})
    }
    });

}
onChangeDepartmentCode() {
  if (this.ConfirmPrint.controls['department'].value == '') {
    this.ConfirmPrint.controls['department'].setValue('');
  } else {
    let currentPlantCodeValue =
      this.ConfirmPrint.controls['department'].value;
    this.isDepCodeSuccess = false;
    this.deptCodeList.forEach((elements) => {
      if (elements.unitCode == currentPlantCodeValue) {
        this.isDepCodeSuccess = true;
      }
    });
    if (this.isDepCodeSuccess == false) {
      this.ConfirmPrint.controls['department'].setErrors({
        incorrect: true,
      });
      this.openDepartmentCodeLOV();
    }
  }
}
openDepartmentCodeLOV() {
  this.displayedColumns = [
    { field: 'unitCode', title: 'Code' },
    { field: 'unitName', title: 'Description' },
  ];
  const dialogRef = this.dialog.open(LovDialogComponent, {
    height: '500px',
    width: '600px',
    data: {
      dialogTitle: 'Department',
      dialogColumns: this.displayedColumns,
      dialogData: this.deptCodeList,
      lovName: 'businessUnitList',
    },
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.selectedDialogData = result.data;
      this.ConfirmPrint.controls['department'].setValue(
        this.selectedDialogData.unitCode
      );
    }
  });
}
onCopyTypeChange() {
  if (this.ConfirmPrint.controls['copyType'].value == '') {
    this.ConfirmPrint.controls['copyType'].setValue('');
  } else {
    this.isCopyTypeValueSuccess = false;
    let currentCopyTypeFieldValue = this.ConfirmPrint.controls['copyType'].value;
    this.ptyList.forEach((elements) => {
      if (elements.prCode == currentCopyTypeFieldValue) {
        this.isCopyTypeValueSuccess = true;
        // this.PrintList.controls['copyType'].setValue(elements.prName);
      }
    });
    if (this.isCopyTypeValueSuccess == false) {
      this.openCopyTypeLOV();
      this.ConfirmPrint.controls['copyType'].setErrors({ incorrect: true });
    }
  }
}

openCopyTypeLOV() {
  this.displayedColumns = [
    { field: 'prCode', title: 'Code' },
    { field: 'prName', title: 'Description' },
  ];
  const dialogRef = this.dialog.open(LovDialogComponent, {
    height: '500px',
    width: '600px',
    data: {
      dialogTitle: 'CopyType',
      dialogColumns: this.displayedColumns,
      dialogData: this.ptyList,
      lovName: 'copyTypetList',
    },
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.selectedDialogData = result.data;
      console.log(this.selectedDialogData);
      this.ConfirmPrint.controls['copyType'].setValue(
        this.selectedDialogData.prName
      );
    }
  });
}
  onDismiss(){
    this.isSuccess=false;
    this.dialogRef.close({data:this.isSuccess})
  }
}
