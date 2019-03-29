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
import { filter } from 'rxjs/operators';
import { DateObjToString } from '../../format';

let __this;
@Component({
    selector: "",
    templateUrl: "./riskReport.component.html",
    styleUrls: ['./riskReport.component.less']
})
export class riskReportComponent implements OnInit {

    constructor(
        private translateSer: TranslateService,
        private service: RiskListService,
        private msg: CommonMsgService,
        private router: Router ,
    ) { };

    ngOnInit() {
        __this = this;
        this.getLanguage();
    };

    languagePack: Object;
    getLanguage() {
        this.translateSer.stream(['common', 'reviewRiskList.tableModule','reviewRiskList.riskReportTable'])
            .subscribe(
                data => {
                    this.languagePack = {
                        common: data['common'],
                        data: data['reviewRiskList.riskReportTable'],
                    };
                    this.initialTable();
                }
            )
    };

    searchModel: SearchModel = new SearchModel();

    changeStatus(status: string) {
        this.searchModel.currentPage = 1;
        this.getRecordList();
    };

    tableData: TableData;
    creditCount:Object;

    initialTable() {
        this.tableData = {
            tableTitle: [
                {
                    name: __this.languagePack['data']['auditDate'],
                    reflect: "auditDateStr",
                    type: "text",
                    // filter: (item) => {
                    //     return unixTime(item.auditDate, 'y-m-d');
                    // }
                }, {
                    name: __this.languagePack['data']['auditOrderTotal'],
                    reflect: "creditOrderCount",
                    type: "text",
                }, {
                    name: __this.languagePack['data']['applyNumberToday'],
                    reflect: "applyCount",
                    type: "text"
                }, {
                    name: __this.languagePack['data']['rejectNumberMachine'],
                    reflect: "machineTrialRefuseCount",
                    type: "text",
                },{
                    name: __this.languagePack['data']['passNumberManul'],
                    reflect: "manualAuditPassCount",
                    type: "text"
                },{
                    name: __this.languagePack['data']['rejectNumberManul'],
                    reflect: "manualAuditRefuseCount",
                    type: "text"
                }, {
                    name: __this.languagePack['data']['totalAuditManul'],
                    reflect: "manualAuditTotalCount",
                    type: "text"
                },{
                    name: __this.languagePack['data']['auditWorkers'],
                    reflect: "auditWorkUserCount",
                    type: "text",
                },{
                    name: __this.languagePack['data']['totalworkingHours'],
                    reflect: "totalWorkHour",
                    type: "text",
                }, {
                    name: __this.languagePack['data']['perCapitalAudit'],
                    reflect: "avgAuditCountByHour",
                    type: "text",
                },{
                    name: __this.languagePack['data']['auditedNumberToday'],
                    reflect: "dayFinishAuditCount",
                    type: "text",
                },{
                    name: __this.languagePack['data']['auditingNumberToday'],
                    reflect: "dayUnFinishAuditCount",
                    type: "text"
                }
            ],
            loading: false,
            showIndex: true,
        };
        this.getCount();
        this.getRecordList();
    };

    totalSize: number = 0;
    getCount(){
        this.service.getCount()
        .subscribe(
            (res: Response) => {
                console.log(res);
                if (res.success !== true) {
                    this.msg.fetchFail(res.message);
                };
                if(res["success"]&&res["data"]["length"]!==0){
                    this.creditCount=res["data"];
                    console.log(this.creditCount);
                }
            }
        )
    }
    getRecordList() {
        this.tableData.loading = true;
        let data = this.searchModel;
        let auditEndDate = DateObjToString( (<Date>data.auditEndDate) );
        data.auditStartDate = DateObjToString( (<Date>data.auditStartDate) ) ;
        data.auditEndDate = auditEndDate && auditEndDate.indexOf(':') == -1 ? auditEndDate  + " 23:59:59" : auditEndDate;
        console.log(data)
        this.service.getRiskTotalList(data)
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
                    if(res["page"]){
                        this.totalSize = res["page"]["totalNumber"];
                    }
                }
            )
    };

    pageChange($size: number, type: string): void {
        if (type == 'size') {
            this.searchModel.pageSize = $size;
        };

        if (type == 'page') {
            this.searchModel.currentPage = $size;
        };
        this.getRecordList();
    };

    reset() {
        this.searchModel = new SearchModel;
        this.getRecordList();
    };

    search(){
        this.searchModel.currentPage = 1 ;
        this.getRecordList() ;
    };
};