import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {CookieService} from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ToolbarService } from '../../service/toolbar.service';


@Component({
    selector: 'app-password-expire-confirmation-dialog',
    templateUrl: './password-expire-confirmation-dialog.component.html',
    styleUrls: ['./password-expire-confirmation-dialog.component.scss'],
    standalone: false
})
export class PasswordExpireConfirmationDialogComponent implements OnInit {
  title: string;
  message: string;
  constructor(public dialogRef: MatDialogRef<PasswordExpireConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PasswordExpireConfirmModel,private authService:AuthService,
    public cookieService:CookieService,private route: Router,public toolbarService: ToolbarService,) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit() {
  }
  tokenData:any;
  tokenId:any;
  onContinue(){
  //   this.tokenData=this.data.loginData.data.token;
  //   this.tokenId=this.data.loginData.data.tokenId;
  //  //const expireInDuration =3600;
  // const expireInDuration =GlobalConstants.expireInDuration;
  // console.log(expireInDuration)
  //  this.authService.setAuthTimer(expireInDuration)
  //  const now =new Date();
  //  const expirationDate= new Date(now.getTime() + expireInDuration*1000);
  //  console.log(expirationDate);
  //  let isAuth=true;
  //  this.cookieService.set('isAuth','true');
  //  this.authService.setIsAuth(isAuth)
  //  this.authService.saveAuthData(this.tokenData,expirationDate,this.data.userId,this.tokenId);
   this.dialogRef.close(false);
   // this.route.navigate(['./data-table'])//need to add new dasboard
    this.route.navigate(['./module-list'])
  }
  onChangePassword(){
    this.dialogRef.close(false);
    this.route.navigate(['./change-password'])
  }
}
export class PasswordExpireConfirmModel {

  constructor(public title: string, public message: string,public loginData:any,public userId:any) {
  }
}
