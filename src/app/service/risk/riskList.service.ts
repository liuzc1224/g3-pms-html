import { Injectable } from "@angular/core";
import { GLOBAL } from '../../global/global_settion';
import { ObjToQuery } from '../ObjToQuery' ;
import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient , HttpParams , HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn : "root"
})
export class RiskListService{
    constructor(
        private http : HttpClient
    ){};
    //获取借款订单风控列表
    getList(paras : Object){

        let para = ObjToQuery(paras) ;

        let url = GLOBAL.API.risk.riskList ;
        return this.http.get(url , {
            params : para
        });
    };


    //获取信审订单风控列表
    getRecordList(paras : Object){

        let para = ObjToQuery(paras) ;

        let url = GLOBAL.API.risk.riskRecordList ;
        return this.http.get(url , {
            params : para
        });
    };

    getCreditOrderRecord(orderId : number){
        let url = GLOBAL.API.risk.record + `/${orderId}`;
        return this.http.get(url);
    };

    getRiskEmployees(){
        let url = GLOBAL.API.risk.employees;
        return this.http.get(url);
    };

    setAllocation(data : Object) {
        let url = GLOBAL.API.risk.setEmployees ;

        let header = new HttpHeaders()
            .set("Content-type" , 'application/json') ;

        return this.http.put(url , data , {
            headers : header
        });
    }

    getTotleList(paras : Object){

        let para = ObjToQuery(paras) ;

        let url = GLOBAL.API.risk.riskTotleList ;
        return this.http.get(url , {
            params : para
        });
    };

    getTotle(paras : Object){

        let para = ObjToQuery(paras) ;

        let url = GLOBAL.API.risk.riskTotle ;
        return this.http.get(url , {
            params : para
        });
    };

    getShureList(paras : Object){

        let para = ObjToQuery(paras) ;

        let url = GLOBAL.API.risk.riskShureList ;
        return this.http.get(url , {
            params : para
        });
    };

    postLoan(data : Object){
        let url = GLOBAL.API.finance.loanList;

        let header = new HttpHeaders()
            .set("Content-type" , 'application/json') ;

        return this.http.post(url , data , {
            headers : header
        });
    };

    makeLoan(data : Object){
        let url = GLOBAL.API.finance.loan.loan ;

        let header = new HttpHeaders()
            .set("Contype-type" , "application/json") ;

        return this.http.patch(url , data , {
            headers : header
        });
    };
    //签到
    riskSignIn(){
        let url = GLOBAL.API.risk.riskSignIn ;
        let header = new HttpHeaders()
            .set("Contype-type" , "application/json") ;
        return this.http.post(url , null, {
            headers : header
        });
    };
    //迁出
    riskSignOut(){
        let url = GLOBAL.API.risk.riskSignOut ;
        let header = new HttpHeaders()
            .set("Contype-type" , "application/json") ;
        return this.http.patch(url , null, {
            headers : header
        });
    };
    //审核签退
    riskSignOutAudit(data : Object){

        let header = new HttpHeaders()
            .set("Contype-type" , "application/json") ;
        let url = GLOBAL.API.risk.riskSignOutAudit;
        return this.http.patch(url , data , {
            headers : header
        });
    };

    //是否签到
    riskIsSignIn(){
        let url = GLOBAL.API.risk.isSignIn ;
        return this.http.get(url);
    };

    //锁订单
    lockOrder( orderId : number){
        let url = GLOBAL.API.risk.lockOrder + "/" + orderId ;
        let header = new HttpHeaders()
            .set("Contype-type" , "application/json") ;
        return this.http.post(url , null, {
            headers : header
        });
    };
    //导出订单
    exportRisk(paras: Object){
        let para = ObjToQuery(paras) ;

        let url = GLOBAL.API.risk.exportList ;
        return this.http.get(url , {
            params : para,
            responseType : 'blob'
        });
    }
    //获取开关
    getSetList(){

        let url = GLOBAL.API.risk.riskConfig ;

        return this.http.get(url);
    };
    //设置开关
    postFaceStatus(data : Object){

        let header = new HttpHeaders()
            .set("Content-type" , 'application/json') ;

        let url = GLOBAL.API.risk.compare ;

        return this.http.put(url , data , {
            headers : header
        });
    };
    //信审报表
    getRiskTotalList(paras : Object){
        console.log(paras);
        let para = ObjToQuery(paras) ;

        let url = GLOBAL.API.risk.riskTotalList ;
        return this.http.get(url , {
            params : para
        });
    };

    //信审操作台列表
    getAuditList(paras : Object){
        let para = ObjToQuery(paras) ;

        let url = GLOBAL.API.risk.auditList ;
        return this.http.get(url , {
            params : para
        });
    }

    //签到
    goSignin(){
        let url = GLOBAL.API.risk.goSignin ;
        let header = new HttpHeaders()
            .set("Contype-type" , "application/json") ;
        return this.http.post(url,null, {
            headers : header
        });
    }
    goSignOut(){
        let url = GLOBAL.API.risk.goSignOut ;
        return this.http.delete(url);
    }
    getAttendanceList(paras : Object){
        let para = ObjToQuery(paras) ;

        let url = GLOBAL.API.risk.attendanceList ;
        return this.http.get(url , {
            params : para
        });
    }
    getCount(){
        let url = GLOBAL.API.risk.getCount;
        return this.http.get(url);
    }
    //查询信审人员签到状态
    querySiginStatus(){
        let url = GLOBAL.API.risk.querySiginStatus;
        return this.http.get(url);
    }
};
