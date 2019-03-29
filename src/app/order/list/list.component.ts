import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Adaptor } from '../../share/tool';
import { TableData } from '../../share/table/table.model';
import { dataFormat } from '../../format';
import { CommonMsgService } from '../../service/msg/commonMsg.service';
import { Response } from '../../share/model/reponse.model';
import { SearchModel }from './searchModel'
import { OrderListService } from '../../service/order';
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../service/storage';
import { Router } from '@angular/router';
import { DateObjToString } from '../../format';

let __this;
@Component({
    selector : "loan-list" ,
    templateUrl : './list.component.html' ,
    styleUrls : ['./list.component.less']
})
export class ListComponent implements OnInit{
    constructor(
        private translateSer: TranslateService ,
        private msg : CommonMsgService ,
        private orderSer : OrderListService ,
        private sgo : SessionStorageService ,
        private router : Router
    ) {};

    ngOnInit(){
      __this=this
      this.getLanguage() ;
    };

    searchModel : SearchModel = new SearchModel() ;

    private searchCondition : Object  = {} ;

    statusEnum : Array< { name :string , value : number} > ;

    languagePack : Object ;


    getLanguage(){
        this.translateSer.stream(["orderList.allList" , 'common'])
            .subscribe(
                data => {
                    this.languagePack = {
                        common : data['common'] ,
                        data : data['orderList.allList'],
                        table:data['orderList.allList']['table']
                    };

                    this.statusEnum = data['orderList.allList']['status'];
                    this.initialTable() ;
                }
            )
    };

    tableData : TableData ;
    initialTable(){

        const Table = this.languagePack['table'] ;
        this.tableData = {
            loading : false ,
            showIndex : true,
            tableTitle : [
                {
                    name : Table['letterReview'] ,
                    reflect : "creditOrderNo" ,
                    type : "text" ,
                },{
                    name : Table['orderNo'] ,
                    reflect : "orderNo" ,
                    type : "text" ,
                },{
                    name : Table['createTime'] ,
                    reflect : "createTimeStr" ,
                    type : "text" ,
                },{
                    name : Table['userNo'] ,
                    reflect : "userId" ,
                    type : "text" ,
                },{
                    name : Table['userName'] ,
                    reflect : "userName" ,
                    type : "text" ,
                },{
                    name : Table['applyCash'] ,
                    reflect : "auditMoney" ,
                    type : "text" ,
                },
                {
                    name : Table['limit'] ,
                    reflect : "loanDays" ,
                    type : "text",
                    filter: (item) => {
                      const totalPeriod=item['totalPeriod'];
                      let Day="";
                      let dayType="";
                      if(totalPeriod===1){
                        Day=item["loanDays"];
                        dayType=__this.languagePack["data"]["dayType"]["day"];
                      }
                      if(totalPeriod>1){
                        Day=item["loanMonths"];
                        dayType=__this.languagePack["data"]["dayType"]["month"];
                      }
                      return (Day && dayType) ? Day+"（"+dayType+"）" : "";
                    }
                },{
                    name : Table['applyTime'] ,
                    reflect : "payDateStr" ,
                    type : "text",
                },{
                    name : Table['period']  ,
                    reflect : "currentPeriod" ,
                    type : "text",
                    filter: (item) => {
                      const currentPeriod = item['currentPeriod'];
                      const totalPeriod=item['totalPeriod'];
                      return (currentPeriod && totalPeriod) ? currentPeriod+" / "+totalPeriod : "";
                    }
                },{
                    name : Table['repayTimeShould']  ,
                    reflect : "planRepaymentDateStr" ,
                    type : "text",
                },{
                    name : Table['repayMoneyShould']  ,
                    reflect : "currentRepay" ,
                    type : "text",
                    filter: (item) => {
                      const currentRepay = item['currentRepay'];
                      return (currentRepay) ? (currentRepay).toFixed(2): "";
                    }
                },{
                    name : Table['dueDay'] ,
                    reflect : "dueDays" ,
                    type : "text",
                },{
                    name : Table['realRepayMoney'] ,
                    reflect : "realRepayMoney" ,
                    type : "text" ,
                },{
                    name : Table['repaymentDate'] ,
                    reflect : "realRepaymentDateStr" ,
                    type : "text" ,
                },{
                    name : Table['orderStatus'] ,
                    reflect : "status" ,
                    type : "mark" ,
                    markColor : {
                        "1" : "#ec971f",
                        "2" :"#87d068" ,
                        "3" : "#1890ff" ,
                        "4" : "#1890ff" ,
                        "5" : "#d9534f"  ,
                        "6" : "#1890ff" ,
                        "7" : "#1890ff" ,
                        "8" : "#d9534f" ,
                        "9" : "#d9534f" ,
                        "10" : "#d9534f" ,
                        "11" : "#d9534f",
                        "12" : "#d9534f",
                        "13" : "#d9534f",
                        "14" : "#1890ff",
                    },
                    filter : ( item ) => {
                        let status = item['status'] ;
                        const totalPeriod=item['totalPeriod'];
                        const map = this.statusEnum ;
                        if(!item['realRepaymentDateStr']){
                          if(status===3){
                            status=14;
                          }
                        }
                        let name = map.filter( item => {
                          return item.value == status ;
                        });
                        return (name && name[0].name ) ? name[0].name : "" ;
                    },
                }
            ] ,
            btnGroup: {
              title: __this.languagePack['data']['opera']['operate'],
              data: [{
                textColor: '#0000ff',
                name: __this.languagePack['data']['orderDetails'],
                bindFn: (item) => {
                  this.router.navigate(['/order/detail'], {
                    queryParams: {
                      order: item['id'],
                      userId: item['userId'],
                    }
                  });
                }
              }]
            }
        };

        this.getList() ;
    };

    totalSize : number ;
    getList(){
        let data = this.searchModel ;
        if(data.createTimeStart && data.createTimeEnd){
          let etime = DateObjToString( (<Date>data.createTimeEnd) );
          data.createTimeStart = DateObjToString( (<Date>data.createTimeStart) ) ;
          data.createTimeEnd = etime && etime.indexOf(':') == -1 ? etime  + " 23:59:59" : etime;
        }
        if(data.planRepaymentDateStart && data.planRepaymentDateEnd){
          let endtime = DateObjToString( (<Date>data.planRepaymentDateEnd) );
          data.planRepaymentDateStart = DateObjToString( (<Date>data.planRepaymentDateStart) ) ;
          data.planRepaymentDateEnd = endtime && endtime.indexOf(':') == -1 ? endtime  + " 23:59:59" : endtime;
        }

        console.log(data);
        this.orderSer.getList(data)
        .pipe(
            filter( ( res : Response) => {
                if(res.success !== true){
                    this.msg.fetchFail(res.message) ;
                };

                this.tableData.loading = false ;

                if(res.data && res.data['length'] === 0){
                    this.tableData.data = [] ;
                    this.totalSize = 0 ;
                };

                return res.success === true  && res.data && (< Array<Object>>res.data).length > 0 ;
            })
        )
        .subscribe(
            ( res : Response ) => {

                let data_arr = res.data ;
                console.log(res.data);
                this.tableData.data = ( <Array< Object > >data_arr );

                this.totalSize = res.page.totalNumber ;

            }
        )
    };

    pageChange($size : number , type : string) : void{
        if(type == 'size'){
            this.searchModel.pageSize = $size ;
        }
        if(type == 'page'){
            this.searchModel.currentPage = $size ;
        }
        this.getList() ;
    };

    reset(){
        this.searchModel = new SearchModel() ;
        this.getList()
    };

    changeStatus( status : string ){

        this.searchModel.status = status ;
        this.searchModel.currentPage = 1;

        this.getList() ;
    };
}
