import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ObjToQuery } from "../ObjToQuery";
import { ObjToQueryString } from "../ObjToQueryString";
import { GLOBAL } from "../../global/global_settion";

@Injectable({
  providedIn: "root"
})
export class ReportService {
  constructor(private http: HttpClient) {}
  exportGroupStatement(obj: Object) {
    let para = ObjToQueryString(obj);
    let url = GLOBAL.API.collectionManagement.report.exportGroupStatement+"?"+para;
    url = url.substring(0,url.length-1);
    console.log(url);
    window.location.href = url;
    return;
  }
  exportStatement(obj: Object) {
    let para = ObjToQueryString(obj);
    let url = GLOBAL.API.collectionManagement.report.exportStatement+"?"+para;
    url = url.substring(0,url.length-1);
    window.location.href = url;
    return;
  }
  getGroupStatement(obj: Object) {
    let url = GLOBAL.API.collectionManagement.report.getGroupStatement;
    let para = ObjToQuery(obj);
    console.log(para);
    return this.http.get(url, {
      params: para
    });
  }
  getStatement(data: Object) {
    let url = GLOBAL.API.collectionManagement.report.getStatement;
    let para = ObjToQuery(data);
    console.log(para);
    return this.http.get(url, {
      params: para
    });
    // let url = GLOBAL.API.collectionManagement.report.getStatement+"?";
    // console.log(data);
    // let para = ObjToQueryString(data);
    // url+=para;
    // url = url.substring(0,url.length-1);
    // return this.http.get(url);
  }
  loanUser(data){
    let url = GLOBAL.API.collectionManagement.report.loanUser;
    let para = ObjToQuery(data);
    return this.http.get(url, {
      params: para
    });
  }
  getAllOverdueGroup(data) {
    let url = GLOBAL.API.collectionManagement.memberManagement.getAllOverdueGroup;
    let para = ObjToQuery(data);
    return this.http.get(url, {
      params: para
    });
  }
  getAllOverdueStaff(data){
    let url = GLOBAL.API.collectionManagement.caseManagement.getAllOverdueStaff;
    let para = ObjToQuery(data);
    return this.http.get(url, {
      params: para
    });
  }
}
