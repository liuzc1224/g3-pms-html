import { Injectable, EventEmitter, OnInit } from "@angular/core";
import { GLOBAL } from '../../global/global_settion';
import { ObjToQuery } from '../ObjToQuery';
import { ObjToQueryString } from '../ObjToQueryString';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: "root"
})
export class OrderListService {

    constructor(
        private http: HttpClient
    ) {};

    getList( data : Object ){
        const url = GLOBAL.API.order.list.all ; 
        
        const para = ObjToQuery(data) ; 

        return this.http.get(url , {
            params : para
        });
    };

};