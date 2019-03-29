import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SearchModel } from './searchModel';
import { Adaptor, ObjToArray } from '../../share/tool';
import { TableData } from '../../share/table/table.model';
import { dataFormatRegular, unixTime, DateObjToString } from '../../format';

import { RiskListService } from '../../service/risk';
import { CommonMsgService } from '../../service/msg/commonMsg.service';
import { Response } from '../../share/model/reponse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../service/storage';

let __this;
@Component({
    selector: "",
    templateUrl: "./riskShureList.component.html",
    styleUrls: ['./riskShureList.component.less']
})
export class riskShureListComponent implements OnInit {

    constructor(
        private translateSer: TranslateService,
        private service: RiskListService,
        private msg: CommonMsgService,
        private fb: FormBuilder,
        private router: Router,
        private sgo: SessionStorageService
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

    validateForm: FormGroup

    getLanguage() {
        this.translateSer.stream(["financeModule.shure", 'common', 'riskModule'])
            .subscribe(
                data => {
                    this.languagePack = {
                        common: data['common'],
                        shure: data['financeModule.shure'],
                        risk: data['riskModule']
                    };
                    this.statusEnum = data['financeModule.shure']['logoutStatus'];
                    console.log(this.statusEnum);

                    this.initialTable();
                }
            )
    };

    searchModel: SearchModel = new SearchModel();
    private searchCondition: Object = {};

    changeStatus(status: string) {

        this.searchModel.signOutState = status;
        this.searchModel.currentPage = 1;
        this.getList();
    };

    tableData: TableData;

    initialTable() {
        this.tableData = {
            tableTitle: [
                {
                    name: __this.languagePack['shure']['table']['name'],
                    reflect: "employeeName",
                    type: "text",
                }, {
                    name: __this.languagePack['shure']['table']['loginStatus'],
                    reflect: "signInState",
                    type: "text",
                    filter: (item) => {
                        const status = item['signInState'];

                        const map = __this.languagePack['shure']['loginStatus'];

                        let name = map.filter(item => {
                            return item.value == status;
                        });

                        return name.length ? name[0].name : "";
                    }

                }, {
                    name: __this.languagePack['shure']['table']['loginTime'],
                    reflect: "createTime",
                    type: "text",
                    filter: (item) => {
                        return unixTime(item.createTime, 'y-m-d h:i:s');
                    }
                }, {
                    name: __this.languagePack['shure']['table']['logoutStatus'],
                    reflect: "signOutState",
                    type: "text",
                    filter: (item) => {
                        const status = item['signOutState'];

                        const map = __this.languagePack['shure']['logoutStatus'];

                        let name = map.filter(item => {
                            return item.value == status;
                        });

                        return name.length ? name[0].name : "";
                    }
                }, {
                    name: __this.languagePack['shure']['table']['logoutTime'],
                    reflect: "signOutTime",
                    type: "text",
                    filter: (item) => {
                        return item.signOutTime ? unixTime(item.signOutTime, 'y-m-d h:i:s') : '';
                    }
                }, {
                    name: __this.languagePack['shure']['table']['noFinsh'],
                    reflect: "unAuditCount",
                    type: "text",
                }
            ],
            loading: false,
            showIndex: true,
            btnGroup: {
                title: __this.languagePack['common']['operate']['name'],
                data: [{
                    textColor: "#80accf",
                    name: __this.languagePack['common']['btnGroup']['g'],
                    showContion: {
                        name: "signOutState",
                        value: [0]
                    },
                    bindFn: (item) => {
                        __this.riskSignOutAudit(item.id, true, item.employeeId)
                    }
                }, {
                    textColor: "#80accf",
                    name: __this.languagePack['common']['btnGroup']['h'],
                    showContion: {
                        name: "signOutState",
                        value: [0]
                    },
                    bindFn: (item) => {
                        __this.riskSignOutAudit(item.id, false, item.employeeId)
                    }
                }]
            }
        };
        this.getList(true);
    };

    initHistoryTable() {
        this.tableData = {
            tableTitle: [
                {
                    name: __this.languagePack['shure']['table']['name'],
                    reflect: "employeeName",
                    type: "text",
                }, {
                    name: __this.languagePack['shure']['table']['loginStatus'],
                    reflect: "signInState",
                    type: "text",
                    filter: (item) => {
                        const status = item['signInState'];

                        const map = __this.languagePack['shure']['loginStatus'];

                        let name = map.filter(item => {
                            return item.value == status;
                        });

                        return (name && name[0].name) ? name[0].name : "";
                    }

                }, {
                    name: __this.languagePack['shure']['table']['loginTime'],
                    reflect: "createTime",
                    type: "text",
                    filter: (item) => {
                        return unixTime(item.createTime, 'y-m-d h:i:s');
                    }
                }, {
                    name: __this.languagePack['shure']['table']['logoutStatus'],
                    reflect: "signOutState",
                    type: "text",
                    filter: (item) => {
                        const status = item['signOutState'];

                        const map = __this.languagePack['shure']['logoutStatus'];

                        let name = map.filter(item => {
                            return item.value == status;
                        });

                        return name.length ? name[0].name : "";
                    }
                }, {
                    name: __this.languagePack['shure']['table']['logoutTime'],
                    reflect: "signOutTime",
                    type: "text",
                    filter: (item) => {
                        return item.signOutTime ? unixTime(item.signOutTime, 'y-m-d h:i:s') : "";
                    }
                }, {
                    name: __this.languagePack['shure']['table']['noFinsh'],
                    reflect: "unAuditCount",
                    type: "text",
                }
            ],
            loading: false,
            showIndex: true
        };
        this.getHistoryList();
    }

    selectItem: object;
    totalSize: number = 0;
    noteMark: boolean = false;
    remark: string = '';
    getList(isfirst? : boolean) {
        //获取当天
        this.tableData.loading = true;
        let _data = new Date();

        let data = this.searchModel;
        let startDay = null;
        let endDay  = null;
        if (isfirst && this.tabsIsActive) {
            startDay = DateObjToString(_data);
            endDay = DateObjToString(_data);
        }else{
            startDay = DateObjToString(data.signInStartTime);
            endDay = DateObjToString(data.signInEndTime);
        }
        data.signInStartTime = startDay;
        data.signInEndTime = endDay && endDay.indexOf(':') == -1 ? endDay  + " 23:59" : endDay;

        let sort = ObjToArray(this.searchCondition);
        data.columns = sort.keys;
        data.orderBy = sort.vals;

        this.service.getShureList(data)
            .pipe(
                filter((res: Response) => {
                    if (res.success !== true) {
                        this.msg.fetchFail(res.message);
                    };

                    this.tableData.loading = false;

                    if (res.data && res.data['length'] === 0) {
                        this.tableData.data = [];
                        this.totalSize = 0;
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

    getHistoryList() {
        this.tableData.loading = true;
        this.searchModel = new SearchModel
        let data = this.searchModel;

        let sort = ObjToArray(this.searchCondition);

        data.columns = sort.keys;
        data.orderBy = sort.vals;

        this.service.getShureList(data)
            .pipe(
                filter((res: Response) => {
                    if (res.success !== true) {
                        this.msg.fetchFail(res.message);
                    };

                    this.tableData.loading = false;

                    if (res.data && res.data['length'] === 0) {
                        this.tableData.data = [];
                        this.totalSize = 0;
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
                    } else {
                        this.msg.operateFail(res.message);
                    };
                }
            )
    };

    search() {
        this.searchModel.currentPage = 1;
        this.getList();
    };

    tabsIsActive: boolean = true;

    tabsCheck(boolean) {
        this.tabsIsActive = boolean;
        if (this.tabsIsActive) {
            this.initialTable();
        } else {
            this.initHistoryTable();
        }
    }

    //审核签退申请
    riskSignOutAudit(id, isAgree, employeeId) {
        let parm = {};
        parm['id'] = id;
        parm['isAgree'] = isAgree;
        parm['signOutEmployeeId'] = employeeId;
        console.log(parm);
        this.service.riskSignOutAudit(parm)
            .subscribe((res: Response) => {
                if (res.success) {
                    this.getList();
                }else{
                    this.msg.operateFail(res.message);
                }
            })
    }
};