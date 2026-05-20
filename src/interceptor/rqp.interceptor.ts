import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class RqpInterceptor implements HttpInterceptor {

  constructor(private cookieService:CookieService) {}

  // intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //   let token = this.cookieService.get('token');
    
  //   if (request.url.includes('authenticate')) {
  //     return next.handle(request); 
  //   }
  //   if (request.url.includes('changepassword')) {
  //     return next.handle(request); 
  //   }
  //   const authRequest=request.clone({
  //     headers:request.headers.set("Authorization","Bearer "+token)
  //   })
  //   return next.handle(authRequest);
  // }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.cookieService.get('token');
  
    // APIs that should not include the Authorization header
    const excludedUrls = [
      'get-top-images',
      'get-scroll-text',
      'rqp-blg/input',
      'rqp-blg/department-list',
      'rqp-blg/client-logo-list',
      'rqp-blg/blg-record-list',
      'rqp-blg/get-rh-image',
      'rqp-blg/get-lh-images',
      'rqp-blg/bup-master/Verification',
      'rqp-blg/bup-master/validate-code',
      'rqp-blg/fetchBgRecord',
      'rqp-blg/bup-master/save-update',
      'imp/impMaster-list',
      'imp/input',
      'imp/get-imptop-images',
      'imp/imp-master-list',
      'imp/get-implh-images',
      'imp/get-imprh-image',
      'imp/pack-list',
      'imp/imp-masterinfo',
      'imp/imp-fetchBgRecord',
      'imp/cart/save-update',
      'imp/packenq-master/save-update',
      'imp/buimp-master/Verification',
      'imp/buimp-master/validate-code',
      //pack master
      'imp/pack-master/get-all',
      'imp/pack-master/get-max-al',
      'imp/pack-master/get-by-code-all',
      'imp/pack-master/save-update',
      'gm/input',
      'admin/userprofile/input',
      'imp/input',
      'imp/pack-master/get-by-max-code'

      ////////
      // 'imp-master-list',
      // 'imp-fetchBgRecord',
      // 'get-implh-images',
      // 'get-imprh-image',
      // 'get-imptop-images',
      // 'buimp-master/validate-code',
      // 'buimp-master/Verification',
      // 'buimp-master/save-update',
      // 'get-scroll-text',
      // 'imp/input',
      // 'impMaster-list',
      // 'rqp-blg/client-logo-list',
    ];
  
    // Check if the request URL matches any of the excluded URLs
    const isExcluded = excludedUrls.some((url) => request.url.includes(url));
  
    // Allow the request to proceed without modification for excluded URLs
    if (isExcluded || request.url.includes('authenticate') || request.url.includes('changepassword')) {
      return next.handle(request);
    }
  
    // Clone and add the Authorization header for other requests
    const authRequest = request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token)
    });
  
    return next.handle(authRequest);
  }
  
}
