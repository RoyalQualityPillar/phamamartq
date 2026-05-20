import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';

import { ToolbarService } from './toolbar.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
    private API_URL=environment.apiBaseURL;
    constructor(
        private http:HttpClient,
        private cookieService:CookieService,
        private route:Router,
        public dialog: MatDialog,
        private toolbarService:ToolbarService
      ) { }

      getHeaderData(body: any) {
        let getHederURL = this.API_URL + 'admin/input/lcinfo';
        return this.http.post(getHederURL, body);
      }
      getReviewerData(
        f0001: any,
        f0009: any,
        pageIndex: any,
        size: any,
        requestType: string
      ) {
        const queryParams = `?FF0001=${f0001}&FF0009=${f0009}&pageIndex=${pageIndex}&size=${size}&requestType=${requestType}`;
        const reviwerURL = this.API_URL + 'gm/gmur-record/todo-all' + queryParams;
        return this.http.get(reviwerURL);
      }
      getReviewerCompletedData(f0003: any, ff0005: any, pageIndex: any, size: any) {
        const queryParams = `?ff0003=${f0003}&ff0005=${ff0005}`;
        const reviwerURL = this.API_URL + 'gmapr/completed-records' + queryParams;
        return this.http.get(reviwerURL);
      }
      getReviewerTerminatedData(f0003: any, ff0005: any, pageIndex: any, size: any) {
        const queryParams = `?ff0003=${f0003}&ff0005=${ff0005}`;
        const reviwerURL = this.API_URL + 'gmapr/Terminated-records' + queryParams;
        return this.http.get(reviwerURL);
      }
      getReviewerObsoletedData(f0003: any, ff0005: any, pageIndex: any, size: any) {
        const queryParams = `?ff0003=${f0003}&ff0005=${ff0005}`;
        const reviwerURL = this.API_URL + 'gmapr/obsoleted-records' + queryParams;
        return this.http.get(reviwerURL);
      }
      getInProcessCompletedData(
        f0003: any,
        ff0005: any,
        pageIndex: any,
        size: any
      ) {
        const queryParams = `?ff0003=${f0003}&ff0005=${ff0005}`;
        const reviwerURL = this.API_URL + 'gmapr/in-process-records' + queryParams;
        return this.http.get(reviwerURL);
      }
      getDMSDropDownList() {
        let token = this.cookieService.get('token');
        let listURL =
          this.API_URL + `dms/input?unitCode=PM1`;
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          }),
        };
        return this.http.get(listURL, httpOptions);
      }
      getDropDownList() {
        let token = this.cookieService.get('token');
        let listURL =
          this.API_URL +
          `admin/userprofile/input?unitCode=PM1`;
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          }),
        };
        return this.http.get(listURL, httpOptions);
      }
      public adminModuleInput(ff0004: string): Observable<any> {
        return this.http.get(
          this.API_URL +
            `admin/module-input?ff0002=${this.cookieService.get(
              'buCode'
            )}&ff0004=${ff0004}`
        );
      }
      public trainingPending(ff0004: string, ff0002: string): Observable<any> {
        return this.http.get(
          `${this.API_URL}gtp/Training-Pending?ff0004=${ff0004}&ff0002=${ff0002}&ff0011=0`
        );
      }
}