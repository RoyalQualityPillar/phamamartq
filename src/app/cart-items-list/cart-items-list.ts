import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { NotificationService } from '../common/notification.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../common/global-constants';
import { apiEndPoints } from '../service/api-service/api-endpoints.constant';
import { ApiService } from '../service/api-service/api.service';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../common/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CartSubmissionComponent } from '../cart-submission/cart-submission.component';

@Component({
  selector: 'app-cart-items-list',
  templateUrl: './cart-items-list.html',
  styleUrl: './cart-items-list.scss',
   standalone: true,
    imports:[AngularMaterialModule, CommonModule, SharedModule, ReactiveFormsModule]
})
export class CartItemsList implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  public fgUnderTestListData: any;
  public dataSource: any;
  public isLoading = false;
     destroy$ = new Subject<void>()
  displayedColumns = [
    'ff0001',
    'ff0003',
    'ff0004',
    'ff0006',
    'createdon',
    'createdby',
    'action',
  ];
  constructor(
    private cookieService: CookieService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    // private remoteLoader: RemoteComponentLoaderService,
    private router: Router,
     private apiService: ApiService,
     @Inject(MAT_DIALOG_DATA) public data,
  ) { }
  ngOnInit(): void {
    console.log(this.data)
     let  gmail = 'agarammounika0505@gmail.com'
    const params = { gmail };
    const HttpMethod = 'GET';
    this.apiService
         .sendRequest(apiEndPoints.cartItemsList, HttpMethod, params)
         .subscribe((data: any) => {
      this.dataSource = data.data;
      this.fgUnderTestListData = new MatTableDataSource(this.dataSource);
      this.fgUnderTestListData.sort = this.sort;
      this.fgUnderTestListData.paginator = this.paginator;
    });
  }
  public pageChanged(event): void {
    if (this.fgUnderTestListData.length == GlobalConstants.size) {
      if (
        event.length - (event.pageIndex + 1) * event.pageSize == 0 ||
        event.length < event.pageSize
      ) {
        this.onPaginationCall();
      }
    }
  }

  public onPaginationCall(): void {
    //todo
  }


  public  submit(row:any){


    const dialogRef = this.dialog.open(CartSubmissionComponent, {
            width: '1500px',
            maxWidth:'2000px',
          height: '500px',
          data: {
            venInfo: this.data,
            gmail: this.data.gmail
          }
          });


//       const component = await this.remoteLoader.loadComponentByKey(
//           'CommonESignatureComponent'
//         );
  
//     const dialogRef = this.dialog.open(component, {
//       height: '300px',
//       width: '600px',
//       data: {},
//       disableClose: true,
//     });
  
//     dialogRef.afterClosed().subscribe((result) => {
  
//       if (result && result.data) {
  
//     this.whService.saveFgUnderTestLList(row.uc0001, row.status).subscribe((data: any) => {
//       if (data.errorInfo != null) {
//         this.isLoading = false;
//         this.dialog.open(MessageDialogComponent, {
//           data: {
//             message: data.errorInfo.message,
//             heading: 'Error Information',
//           },
//         });
//       } else {
//         this.isLoading = false;
//         this.notificationService.showSuccess(data.status, () => {
//           // this.fgUnderTestListData.reset();
//           //                    timer(2000)
//           //                                .pipe(takeUntil(this.destroy$))
//           //                                .subscribe(() => {
//                                            this.router.navigateByUrl('/rqpoperationui/wh/sm-module-admin');
//                                          //});
//         });
//       }
//     });
//   }
// });
}
}

