import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SearchModel } from './searchModel';
import { Adaptor , ObjToArray } from '../../share/tool' ;
import { TableData } from '../../share/table/table.model';
import { unixTime } from '../../format';

import { RiskListService } from '../../service/risk';
import { CommonMsgService } from '../../service/msg/commonMsg.service';
import { Response } from '../../share/model/reponse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../service/storage';
import { DateObjToString } from '../../format';

let __this;
@Component({
    selector: "",
    templateUrl: "./riskTotleList.component.html",
    styleUrls: ['./riskTotleList.component.less']
})
export class riskTotleListComponent implements OnInit {

    constructor(
        private translateSer: TranslateService,
        private service: RiskListService,
        private msg: CommonMsgService,
        private fb: FormBuilder,
        private router: Router ,
        private sgo : SessionStorageService
    ) { };

    ngOnInit() {
        __this = this;

        this.getLanguage();

        this.validateForm = this.fb.group({
            "orderStatus": [null, [Validators.required]],
            "backName": [null, [Validators.required]],
            "billNo": [null, [Validators.required]],
            "account": [null, [Validators.required]],
            "reamark": [null]
        });

    };

    languagePack: Object;

    statusEnum: Array<Object>;

    validateForm: FormGroup ;

    RiskTotle : Array<Object> = [] ;

    getLanguage() {
        this.translateSer.stream(['common', 'riskModule', 'financeModule.totle'])
            .subscribe(
                data => {
                    this.languagePack = {
                        common: data['common'],
                        risk: data['riskModule'],
                        totle: data['financeModule.totle']
                    };
                    this.statusEnum = data['riskModule']['searchTabStatus'];

                    this.initialTable();
                }
            )
    };

    searchModel: SearchModel = new SearchModel();
    private searchCondition : Object  = {} ;

    tableData: TableData;

    initialTable() {
        this.tableData = {
            tableTitle: [
                {
                    name: __this.languagePack['totle']['table']['reqDate'],
                    reflect: "auditDate",
                    type: "text",
                    filter: (item) => {
                        return unixTime(item.auditDate, 'y-m-d');
                    },
                    sort : true ,
                    sortFn : ( val , item ) => {
                        const column = item.reflect ;

                        if(val == 'top'){
                            this.searchCondition[column] = true ;
                        }else{
                            this.searchCondition[column] = false;
                        };

                        this.getList() ;
                    }
                }, {
                    name: __this.languagePack['totle']['table']['orderTotle'],
                    reflect: "orderCount",
                    type: "text"
                }, {
                    name: __this.languagePack['totle']['table']['refMachine'],
                    reflect: "ruleRefuseCount",
                    type: "text"
                }, {
                    name: __this.languagePack['totle']['table']['rushUser'],
                    reflect: "passCount",
                    type: "text",
                    // sort : true ,
                    // sortFn : ( val , item ) => {
                    //     const column = item.reflect ;

                    //     if(val == 'top'){
                    //         this.searchCondition[column] = true ;
                    //     }else{
                    //         this.searchCondition[column] = false;
                    //     };

                    //     this.getList() ;
                    // }
                },{
                    name: __this.languagePack['totle']['table']['limit'],
                    reflect: "signInCount",
                    type: "text",
                    // sort : true ,
                    // sortFn : ( val , item ) => {
                    //     const column = item.reflect ;

                    //     if(val == 'top'){
                    //         this.searchCondition[column] = true ;
                    //     }else{
                    //         this.searchCondition[column] = false;
                    //     };

                    //     this.getList() ;
                    // }
                }, {
                    name: __this.languagePack['totle']['table']['beginTime'],
                    reflect: "allocateBeginTime",
                    filter: (item) => {
                        return unixTime(item.allocateBeginTime, 'y-m-d h:i:s');
                    },
                    type: "text",
                }, {
                    name: __this.languagePack['totle']['table']['endTime'],
                    reflect: "allocateOverTime",
                    filter: (item) => {
                        return unixTime(item.allocateOverTime, 'y-m-d h:i:s');
                    },
                    type: "text",
                },{
                    name: __this.languagePack['totle']['table']['status'],
                    reflect: "allocateState",
                    type: "mark",
                    markColor: { "1": "#ec971f", "2": "#87d068", "9": "#d9534f", "12": "#d9534f" },
                    filter: (item) => {
                        const status = item['allocateState'];

                        const map = __this.languagePack['risk']['allocateState'];
                        let name = map.filter(item => {
                            return item.value == status;
                        });

                        return (name && name[0].name) ? name[0].name : "no";
                    },
                    // sort : true ,
                    // sortFn : ( val , item ) => {
                    //     const column = item.reflect ;

                    //     if(val == 'top'){
                    //         this.searchCondition[column] = true ;
                    //     }else{
                    //         this.searchCondition[column] = false;
                    //     };

                    //     this.getList() ;
                    // },
                }, {
                    name: __this.languagePack['totle']['table']['todayFinsh'],
                    reflect: "dayAlreadyComplete",
                    type: "text",
                }, {
                    name: __this.languagePack['totle']['table']['todayNoFinsh'],
                    reflect: "dayUnComplete",
                    type: "text",
                }
            ],
            loading: false,
            showIndex: true
        };
        this.getList();
        this.getRiskTotle();
    };

    selectItem: object;
    totalSize: number = 0;
    makeLoanMark: boolean = false;
    noteMark : boolean = false ;
    remark : string = '' ;
    getList() {

        this.tableData.loading = true;

        let data = this.searchModel;
        let etime = DateObjToString( (<Date>data.maxAuditDate) );

        data.minAuditDate = DateObjToString( (<Date>data.minAuditDate) ) ;
        data.maxAuditDate = etime && etime.indexOf(':') == -1 ? etime  + " 23:59:59" : etime;

        let sort = ObjToArray(this.searchCondition) ;

        data.columns = sort.keys ;
        data.orderBy = sort.vals ;

        this.service.getTotleList(data)
            .pipe(
                filter((res: Response) => {
                    if (res.success !== true) {
                        this.msg.fetchFail(res.message);
                    };

                    this.tableData.loading = false;

                    if (res.data && res.data['length'] === 0) {
                        this.tableData.data = [];
                        this.totalSize = 0 ;
                    };

                    return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
                })
            )
            .subscribe(
                (res: Response) => {

                    let data_arr = res.data;

                    this.tableData.data = (<Array<Object>>data_arr);

                    this.totalSize = res.page.totalNumber;
                }
            )
    };

    getRiskTotle(){

        let data = this.searchModel;
        this.service.getTotle(data)
            .pipe(
                filter( res => {

                    if (res['success'] !== true) {

                        this.msg.fetchFail(res['message']);

                    };

                    return res['success'] === true && res['data'];
                })
            )
            .subscribe(
                (res: Response) => {
                    this.RiskTotle = [];
                    this.RiskTotle.push(res.data);
                }
            )
    }

    pageChange($size: number, type: string): void {
        if (type == 'size') {
            this.searchModel.pageSize = $size;
        };

        if (type == 'page') {
            this.searchModel.currentPage = $size;
        };
        this.getList();
    };

    reset() {
        this.searchModel = new SearchModel;

        this.getList();
    };

    makeNew($event) {
        let data = this.validateForm.value;

        let el = <HTMLButtonElement>$event.target;

        el.disabled = true;

        this.service.postLoan(data)
            .subscribe(
                (res: Response) => {
                    if (res.success === true) {

                        this.msg.operateSuccess();

                        this.getList();

                        this.makeLoanMark = false;
                    } else {
                        this.msg.operateFail(res.message);
                    };
                }
            )
    };

    search(){
        this.searchModel.currentPage = 1 ;
        this.getList() ;
    };
};