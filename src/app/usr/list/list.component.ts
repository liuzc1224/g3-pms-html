import { Component , OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SearchModel } from './searchModel' ;
import { Adaptor , ObjToArray } from '../../share/tool' ;
import { TableData } from '../../share/table/table.model' ;
import { unixTime } from '../../format';

import { UserListService } from '../../service/user' ;
import { CommonMsgService } from '../../service/msg/commonMsg.service' ;
import { Response } from '../../share/model/reponse.model' ;
import { FormGroup , FormBuilder, Validators } from '@angular/forms'
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router' ;
import { SessionStorageService } from '../../service/storage';
import { DateObjToString } from '../../format';
let __this ;
@Component({
    selector : "" ,
    templateUrl : "./list.component.html" ,
    styleUrls : ['./list.component.less']
})
export class ListComponent implements OnInit{

    constructor(
        private translateSer : TranslateService ,
        private service : UserListService ,
        private msg : CommonMsgService ,
        private router : Router ,
        private sgo : SessionStorageService
    ){} ;

    ngOnInit(){
        __this = this ;
        this.getLanguage() ;
    };

    languagePack : Object ;

    getLanguage(){
        this.translateSer.stream(["usrModule.list" , 'common' , 'orderList'])
            .subscribe(
                data => {
                    this.languagePack = {
                        common : data['common'] ,
                        data : data['usrModule.list'] ,
                        order : data['orderList']
                    };
                    this.initialTable() ;

                    this.enumStatus = this.languagePack['order']['allList']['status'] ;
                }
            )
    };

    searchModel : SearchModel = new SearchModel() ;

    tableData : TableData ;

    private searchCondition : Object  = {} ;

    enumStatus : Array< Object > ;

    initialTable(){
        this.tableData = {
            tableTitle : [
                {
                    name : __this.languagePack['data']['table']['userId'] ,
                    reflect : "id" ,
                    type : "text"
                },
                // {
                //     name : __this.languagePack['data']['table']['realName'] ,
                //     reflect : "username" ,
                //     type : "text"
                // },
                {
                    name : __this.languagePack['data']['table']['mobile'] ,
                    reflect : "phoneNumber" ,
                    type : "text"
                },
                {
                    name : __this.languagePack['data']['table']['email'] ,
                    reflect : "email" ,
                    type : "text"
                },
                {
                    name : __this.languagePack['data']['table']['CPF'] ,
                    reflect : "cpf" ,
                    type : "text"
                },
                // {
                //     name : __this.languagePack['data']['table']['idCard'] ,
                //     reflect : "idNumber" ,
                //     type : "text"
                // },
                {
                    name : __this.languagePack['data']['table']['registeDate'] ,
                    reflect : "registerTime" ,
                    type : "text" ,
                    /*sort : true ,
                    sortFn : ( val , item ) => {
                        const column = item.reflect ;

                        if(val == 'top'){
                            this.searchCondition[column] = true ;
                        }else{
                            this.searchCondition[column] = false;
                        };

                        this.getList() ;
                    },*/
                filter : ( item ) =>{
                        return unixTime(item.registerTime) ;
                    }
                }/*,{
                    name : __this.languagePack['order']['allList']['table']['status'] ,
                    reflect : "" ,
                    type : "text"
                }*/
                ,
                {
                    name : __this.languagePack['data']['table']['regFrom'] ,
                    reflect : "registerSource" ,
                    type : "text"
                }
                ,
                {
                    name : __this.languagePack['data']['table']['channelIdentify'] ,
                    reflect : "channelMark" ,
                    type : "text"
                }
            ] ,
            loading : false ,
            showIndex : true ,
            btnGroup : {
                title : __this.languagePack['common']['operate']['name'] ,
                data : [{
                    textColor : "#80accf",
                    name : __this.languagePack['common']['btnGroup']['a'],
                    bindFn : (item) => {
                        let parentName = this.sgo.get("routerInfo")

                        let menuName = this.languagePack['common']['btnGroup']['a'] ;

                        this.sgo.set("routerInfo" , {
                            parentName : parentName.menuName,
                            menuName : menuName
                        });

                        this.router.navigate(['/usr/detail'] , {
                            queryParams : {
                                from : "user" ,
                                usrId : item.id
                            }
                        });
                    }
                }]
            }
        };
        this.getList() ;
    };

    selectItem : object ;
    totalSize : number = 0 ;
    makeLoanMark : boolean =false ;
    getList(){
        this.tableData.loading = true ;
        let data = this.searchModel ;
        let etime = DateObjToString( (<Date>data.registerTimeEnd) );
        data.registerTimeStart = DateObjToString( (<Date>data.registerTimeStart) ) ;
        data.registerTimeEnd = etime && etime.indexOf(':') == -1 ? etime  + " 23:59:59" : etime;
        let sort = ObjToArray(this.searchCondition) ;
        data.columns = sort.keys ;
        data.orderBy = sort.vals ;
        this.service.getList(data)
            .pipe(
                filter( (res : Response) => {

                    this.tableData.loading = false ;

                    if(res.success === false){
                        this.msg.fetchFail(res.message) ;
                    };

                    if(  ( < Array< Object > >res.data ).length == 0 ){
                        this.tableData.data = [] ;
                        this.totalSize = 0 ;
                    };

                    return res.success === true &&  ( < Array< Object > >res.data).length > 0 ;
                })
            )
            .subscribe(
                ( res : Response ) => {

                    this.tableData.data = (< Array<Object> >res.data);

                    this.totalSize = res.page.totalNumber ;
                }
            );
    };

    pageChange($size : number , type : string) : void{
        if(type == 'size'){
            this.searchModel.pageSize = $size ;
        };

        if(type == 'page'){
            this.searchModel.currentPage = $size ;
        };
        this.getList() ;
    };

    reset(){
        this.searchModel = new SearchModel ;
        this.getList() ;
    };

    search(){
        this.searchModel.currentPage = 1 ;
        this.getList() ;
    };
};