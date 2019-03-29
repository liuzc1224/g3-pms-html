import { Injectable } from '@angular/core' ;
import {HttpClient, HttpHeaders} from '@angular/common/http' ;
import { ObjToQuery } from '../ObjToQuery';
import { ObjToQueryString } from '../ObjToQueryString' ;
import { GLOBAL } from '../../global/global_settion';

@Injectable({
  providedIn : "root"
})
export class ProductService{
  constructor(
    private http : HttpClient
  ){} ;


  getProduct(obj : Object){
    let url = GLOBAL.API.productCenter.product.getProduct ;
    let para = ObjToQuery(obj) ;
    return this.http.get(url , {
      params : para
    });
  }
  updateProduct( data : Object){
    let url = GLOBAL.API.productCenter.product.updateProduct;
    let header = new HttpHeaders()
      .set("Content-type" , 'application/json') ;
    console.log(data);
    return this.http.put(url,data,{
      headers : header
    });
  }
  addProduct(data : Object){
    let url = GLOBAL.API.productCenter.product.addProduct;
    let header = new HttpHeaders()
      .set("Content-type" , 'application/json') ;
    return this.http.post(url , data , {
      headers : header
    });
  }
  deleteProduct(data : Object){
    let url = GLOBAL.API.productCenter.product.deleteProduct;
    console.log(data);
    return this.http.get(url+"/"+data["id"]);
  }
}
