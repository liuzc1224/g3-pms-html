import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TableData } from '../../share/table/table.model';

import { RiskListService } from '../../service/risk';
import { CommonMsgService } from '../../service/msg/commonMsg.service';
import { Response } from '../../share/model/reponse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../service/storage';

let __this;
@Component({
    selector: "",
    templateUrl: "./riskSetting.component.html",
    styleUrls: ['./riskSetting.component.less']
})
export class riskSettingComponent implements OnInit {

    constructor(
        private translateSer: TranslateService,
        private service: RiskListService,
        private msg: CommonMsgService,
        private fb: FormBuilder,
        private sgo : SessionStorageService
    ) { };

    ngOnInit() {
        __this = this;

        this.getLanguage();

        this.validateForm = this.fb.group({
            "businessId": [null],
            "exemptionDays": [null, [Validators.required]],
            "status": [null]
        });

    };

    languagePack: Object;

    validateForm: FormGroup;

    getLanguage() {
        this.translateSer.stream(["financeModule.list", 'common', 'riskModule', 'reviewRiskList.manageModule'])
            .subscribe(
                data => {
                    this.languagePack = {
                        common: data['common'],
                        data: data['financeModule.list'],
                        risk: data['riskModule'],
                        manage: data['reviewRiskList.manageModule']
                    };

                    this.initialTable();
                }
            )
    };

    tableData: TableData;

    initialTable() {
        this.tableData = {
            tableTitle: [
                {
                    name: __this.languagePack['manage']['functionName'],
                    reflect: "functionName",
                    type: "text"
                }, {
                    name: __this.languagePack['manage']['tips'],
                    reflect: "remark",
                    type: "text"
                }, {
                    name: __this.languagePack['manage']['status'],
                    reflect: "status",
                    type: "text",
                    filter: (item) => {
                        const status = item['status'];
            
                        const map = __this.languagePack['risk']['settingStatus'];
            
                        let desc = map.filter(item => {
                            return item.value == status;
                        });
                        return (desc && desc[0].name) ? desc[0].name : "no";
                    }
                      
                }
            ],
            loading: false,
            showIndex: true,
            btnGroup: {
                title: __this.languagePack['common']['operate']['name'],
                data: [{
                    textColor: "#80accf",
                    name: __this.languagePack['common']['btnGroup']['a'],
                    // ico : "anticon anticon-pay-circle-o" ,
                    bindFn: (item) => {
                      this.selectItem = item;
    
                      ( item.id === 1 ) ? this.hidden=true :this.hidden=false;
                      this.validateForm.patchValue({
                        status: item.status,
                        businessId: item.businessId,
                        exemptionDays: item.exemptionDays
                      });
                      this.riskSetMark = true;
                    }
                }]
            }
        };
        this.getList();
    };

    selectItem: object;
    riskSetMark: boolean = false;
    getList() {

        this.tableData.loading = true;

        this.service.getSetList()
            .pipe(
                filter((res: Response) => {
                    if (res.success !== true) {
                        this.msg.fetchFail(res.message);
                    };

                    this.tableData.loading = false;

                    if (res.data && res.data['length'] === 0) {
                        this.tableData.data = [];
                    };

                    return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
                })
            )
            .subscribe(
                (res: Response) => {

                    let data_arr = res.data;

                    this.tableData.data = (<Array<Object>>data_arr);

                }
            )
    };

    hidden:Boolean = false;

    makeNew(){
        let data = this.validateForm.value;
        if(this.hidden){
            this.makeLoan(data);
        }else{
            if (!data.exemptionDays) {
                let msg = this.languagePack['common']['tips']['notEmpty'];

                this.msg.operateFail(msg);
                return;
            }
            this.makeLoan(data);
        }
    }
    makeLoan(data){
        let postData = {
            'businessId': data.businessId,
            'status': data.status,
            'exemptionDays': data.exemptionDays || '0'
        }
        this.service.postFaceStatus(postData)
            .pipe(
            filter((res: Response) => {
    
                if (res.success !== true) {
                this.msg.operateFail(res.message);
                };
                return res.success === true;
            })
            )
            .subscribe(
            (res: Response) => {
    
                this.msg.operateSuccess();
    
                this.getList();
    
                this.riskSetMark = false;
            }
            );
    }
};