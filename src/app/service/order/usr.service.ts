import { Injectable, EventEmitter, OnInit } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { ObjToQueryString } from "../ObjToQueryString";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private http: HttpClient) {}

  getBasicInfo(usrId: number) {
    const url = GLOBAL.API.order.user.basicInfo + "/" + usrId;

    return this.http.get(url);
  }

  getAccountInfo(userId: number) {
    const url = GLOBAL.API.order.user.accountInfo + "/" + userId;

    return this.http.get(url);
  }

  getAuth(usrId: number, data: object) {
    const para = ObjToQuery(data);

    const url = GLOBAL.API.order.user.auth + "/" + usrId;

    return this.http.get(url, {
      params: para
    });
  }

  getOrderAuth(usrId: number, data: object) {
    const para = ObjToQuery(data);

    const url = GLOBAL.API.order.user.orderauth + "/" + usrId;

    return this.http.get(url, {
      params: para
    });
  }

  getOrderDetailinfo(usrId: number, data: object) {
    const para = ObjToQuery(data);

    const url = GLOBAL.API.order.user.orderdetailinfo + "/" + usrId;

    return this.http.get(url, {
      params: para
    });
  }

  getUserLoginInfo(usrId: number) {
    const url = GLOBAL.API.order.user.userInfo + "/" + usrId;

    return this.http.get(url);
  }

  getDetailinfo(usrId: number, data: object) {
    const para = ObjToQuery(data);

    const url = GLOBAL.API.order.user.detailinfo + "/" + usrId;

    return this.http.get(url, {
      params: para
    });
  }

  getFamilyInfo(usrId: number) {
    const url = GLOBAL.API.order.user.familyInfo + "/" + usrId;

    return this.http.get(url);
  }

  getWorkInfo(usrId: number) {
    const url = GLOBAL.API.order.user.workInfo + "/" + usrId;

    return this.http.get(url);
  }

  getFriendInfo(usrId: number) {
    const url = GLOBAL.API.order.user.friendInfo + "/" + usrId;

    return this.http.get(url);
  }

  getBankInfo(userId: number) {
    const url = GLOBAL.API.order.user.bankInfo + "/" + userId;
    return this.http.get(url);
  }

  getOrderHisList(userId: number) {
    const url = GLOBAL.API.order.user.orderHisList + "/" + userId;
    return this.http.get(url);
  }

  getRecordList(userId: number) {
    const url = GLOBAL.API.order.user.recordDetail + "/" + userId;
    return this.http.get(url);
  }
}
