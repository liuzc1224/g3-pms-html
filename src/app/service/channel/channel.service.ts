import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ObjToQuery } from "../ObjToQuery";
import { ObjToQueryString } from "../ObjToQueryString";
import { GLOBAL } from "../../global/global_settion";

@Injectable({
  providedIn: "root"
})
export class ChannelService {
  constructor(private http: HttpClient) {}
  getList(obj: Object) {
    let url = GLOBAL.API.channel.getList;
    let para = ObjToQuery(obj);
    return this.http.get(url, {
      params: para
    });
  }
  update(data: Object) {
    let url = GLOBAL.API.channel.update;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.put(url, data, {
      headers: header
    });
  }
  addChannel(data: Object) {
    let url = GLOBAL.API.channel.addChannel;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data, {
      headers: header
    });
  }
}
