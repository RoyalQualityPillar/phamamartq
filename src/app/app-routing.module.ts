import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../interceptor/auth.guard';
import { PageNotFoundComponent } from './toolbar/page-not-found/page-not-found.component';
import { MasterDataManagementComponent } from './master-data-management/master-data-management.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/blog',
    pathMatch: 'full'
  },
  {
    path: 'blog',
    component: MasterDataManagementComponent
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
