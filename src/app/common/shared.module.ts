
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BkTableModule } from 'bk-angular-table';

import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { CustomDatePipe } from '../pipe/custom-date.pipe';
import { BackgroundColorPipe } from './pipe/background-color.pipe';

import { ShareHostDataService } from '../service/share-host-data.service';

@NgModule({
  declarations: [
    BackgroundColorPipe
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    NgApexchartsModule,
    BkTableModule,
    CustomDatePipe
  ],
  exports: [
  ],
  
  providers: [
    ShareHostDataService,
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class SharedModule { }

// 🔁 Explicitly export components for dynamic loading with Module Federation
export {
};
