import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { BkTableModule } from 'bk-angular-table';

@Component({
    selector: 'app-lov-dialog',
    templateUrl: './lov-dialog.component.html',
    styleUrls: ['./lov-dialog.component.scss'],
    standalone: true,
    imports:[AngularMaterialModule, BkTableModule]
})
export class LovDialogComponent implements OnInit {
  dialogColumns: any;
  dialogData: any;
  selectedData: any;
  lovName: any;
  dialogTitle: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public refDialog: MatDialogRef<LovDialogComponent>
  ) {}

  ngOnInit() {
    this.dialogColumns = this.data.dialogColumns;
    this.dialogData = this.data.dialogData;
    this.dialogTitle = this.data.dialogTitle;
  }
  onSelectedChange(val) {
    this.selectedData = val;
    this.refDialog.close({ data: this.selectedData });
  }

  closePopUp() {
    this.refDialog.close();
  }
  onPagination(event: any) {
    //todo
  }
}
