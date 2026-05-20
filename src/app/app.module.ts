import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { App } from './app';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './common/shared.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MessageDialogComponent } from './common/message-dialog/message-dialog.component';
import { PasswordExpireConfirmationDialogComponent } from './common/password-expire-confirmation-dialog/password-expire-confirmation-dialog.component';
import { FooterComponent } from './toolbar/footer/footer.component';
import { HeaderComponent } from './toolbar/header/header.component';
import { PageNotFoundComponent } from './toolbar/page-not-found/page-not-found.component';
import { PreviewFileComponent } from './toolbar/preview-file/preview-file.component';
import { SessionExpireDialogComponent } from './toolbar/session-expire-dialog/session-expire-dialog.component';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from '../interceptor/custom-route-reuse-strategy';
import { ErrorInterceptor } from '../interceptor/error.interceptor';
import { RqpInterceptor } from '../interceptor/rqp.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { MatTableExporterModule } from 'mat-table-exporter';
import { BkTableModule } from 'bk-angular-table';
import { MasterDataManagementComponent } from './master-data-management/master-data-management.component';
import { PimpBlogDescriptionComponent } from './pimp-blog-description/pimp-blog-description.component';
import { CartSubmissionComponent } from './cart-submission/cart-submission.component';
import { PrintConfirmationComponent } from './print-confirmation/print-confirmation.component';

@NgModule({
  declarations: [
    App,
    FooterComponent,
    MessageDialogComponent,
    PageNotFoundComponent,
    PasswordExpireConfirmationDialogComponent,
    SessionExpireDialogComponent,
    PreviewFileComponent,
    HeaderComponent,
    PrintConfirmationComponent
  ],
  imports: [
    PimpBlogDescriptionComponent,
    CartSubmissionComponent,
    MasterDataManagementComponent,
    BrowserModule,
    HttpClientModule,
    AngularMaterialModule,
    CommonModule,
    BrowserAnimationsModule,
    NgxExtendedPdfViewerModule,
    AppRoutingModule,
    MatTableExporterModule,
    ReactiveFormsModule,
    BkTableModule
],
  providers: [
    CookieService,
    DatePipe,
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: RqpInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [App]
})
export class AppModule {}
