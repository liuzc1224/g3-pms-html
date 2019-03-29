import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ObjToQuery } from "../ObjToQuery";
import { GLOBAL } from "../../global/global_settion";

@Injectable({
  providedIn: "root"
})
export class RecordService{
  constructor(private http: HttpClient) {}
  queryOverdueCallRecord(obj: Object) {
    let url = GLOBAL.API.collectionManagement.record.queryOverdueCallRecord;
    let para = ObjToQuery(obj);
    return this.http.get(url, {
      params: para
    });
  }
  queryOverdueMessageRecord(obj: Object) {
    let url = GLOBAL.API.collectionManagement.record.queryOverdueMessageRecord;
    let para = ObjToQuery(obj);
    return this.http.get(url, {
      params: para
    });
  }
}
