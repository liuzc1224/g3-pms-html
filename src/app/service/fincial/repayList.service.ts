import { Injectable } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class RepayListService {
  constructor(private http: HttpClient) {}

  getList(paras: Object) {
    let para = ObjToQuery(paras);

    let url = GLOBAL.API.finance.repayList;
    return this.http.get(url, {
      params: para
    });
  }

  makeRepay(data: Object) {
    let url = GLOBAL.API.finance.repay.repay;

    let header = new HttpHeaders().set("application", "application.json");

    return this.http.patch(url, data, {
      headers: header
    });
  }
}
