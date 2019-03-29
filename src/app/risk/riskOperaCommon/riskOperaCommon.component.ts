import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { SearchModel } from "./searchModel";
import { TableData } from "../../share/table/table.model";
import { unixTime } from "../../format";

import { RiskListService } from "../../service/risk";
import { CommonMsgService } from "../../service/msg/commonMsg.service";
import { Response } from "../../share/model/reponse.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { filter } from "rxjs/operators";
import { SessionStorageService } from "../../service/storage";
import { DateObjToString, reviewOrderStatustransform } from "../../format";

let __this;
@Component({
  selector: "",
  templateUrl: "./riskOperaCommon.component.html",
  styleUrls: ["./riskOperaCommon.component.less"]
})
export class riskOperaCommon implements OnInit {
  constructor(
    private translateSer: TranslateService,
    private service: RiskListService,
    private msg: CommonMsgService,
    private fb: FormBuilder,
    private router: Router,
    private sgo: SessionStorageService
  ) {}

  ngOnInit() {
    __this = this;
    this.querySiginStatus();
    console.log(this.isSignin);
    console.log(this.isAllocate);
    this.getLanguage();
  }
  isSignin: number;
  isAllocate: number;
  siginData: Object;
  canSignIn: boolean;
  languagePack: Object;

  statusEnum: Array<Object>;
  statusEnum1: Array<Object>;
  validateForm: FormGroup;

  userLoginInfo: Object;

  roleShowPage: boolean = true;

  creditOrderNo: string;

  makeLoanMark: boolean;
  noteMark: boolean;

  getLanguage() {
    this.translateSer.stream(["common", "reviewRiskList.tableModule"]).subscribe(data => {
      this.languagePack = {
        common: data["common"],
        data: data["reviewRiskList.tableModule"]
      };
      this.statusEnum = data["common"]["auditOperaCommon"];
      this.initialTable();
    });
  }

  searchModel: SearchModel = new SearchModel();

  changeStatus(status: string) {
    this.searchModel.status = status;
    this.searchModel.currentPage = 1;
    this.getRecordList();
  }

  tableData: TableData;

  initialTable() {
    this.tableData = {
      tableTitle: [
        {
          name: __this.languagePack["data"]["applyDateStr"],
          reflect: "applyDateStr",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["creditOrderNo"],
          reflect: "creditOrderNo",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["userPhone"],
          reflect: "userPhone",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["userGrade"],
          reflect: "userGrade",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["approveAmount"],
          reflect: "approveAmountMin",
          type: "text",
          filter: item => {
            let prod = item["productVOList"].filter(res => {
              return res["loanProductType"] === 1;
            });
            if (prod.length) {
              const approveAmountMin = prod[0]["approveAmountMin"];
              const approveAmountMax = prod[0]["approveAmountMax"];
              return `${approveAmountMin}~${approveAmountMax}`;
            } else {
              return "";
            }
          }
        },
        {
          name: __this.languagePack["data"]["approveDate"],
          reflect: "loanDays",
          type: "text",
          filter: item => {
            let time;
            let prod = item["productVOList"].filter(res => {
              return res["loanProductType"] === 1;
            });
            if (prod.length) {
              const loanTermMix = prod[0]["loanTermMix"];
              const loanTermMax = prod[0]["loanTermMax"];
              if (prod[0]["loanTermType"] === 2) {
                time = `${loanTermMix}~${loanTermMax}月`;
              } else {
                time = `${loanTermMix}~${loanTermMax}日`;
              }
              return time;
            } else {
              return "";
            }
          }
        },
        {
          name: __this.languagePack["data"]["fapproveAmount"],
          reflect: "approveAmountMin",
          type: "text",
          filter: item => {
            let prod = item["productVOList"].filter(res => {
              return res["loanProductType"] === 2;
            });
            if (prod.length) {
              const approveAmountMin = prod[0]["approveAmountMin"];
              const approveAmountMax = prod[0]["approveAmountMax"];
              return `${approveAmountMin}~${approveAmountMax}`;
            } else {
              return "";
            }
          }
        },
        {
          name: __this.languagePack["data"]["fapproveDate"],
          reflect: "loanDays",
          type: "text",
          filter: item => {
            let time;
            let prod = item["productVOList"].filter(res => {
              return res["loanProductType"] === 2;
            });
            if (prod.length) {
              const loanTermMix = prod[0]["loanTermMix"];
              const loanTermMax = prod[0]["loanTermMax"];
              if (prod[0]["loanTermType"] === 2) {
                time = `${loanTermMix}~${loanTermMax}月`;
              } else {
                time = `${loanTermMix}~${loanTermMax}日`;
              }
              return time;
            } else {
              return "";
            }
          }
        },
        {
          name: __this.languagePack["data"]["approveDays"],
          reflect: "approveDays",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["approveEffectDay"],
          reflect: "approveEffectDayStr",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["approveExpDay"],
          reflect: "approveExpDayStr",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["commonName"],
          reflect: "adminName",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["creditIdea"],
          reflect: "creditIdea",
          type: "text",
          filter: item => {
            const creditIdea = item["creditIdea"];
            const creditIdeaRemark = item["creditIdeaRemark"];
            if(creditIdea&&!creditIdeaRemark){
              return creditIdea
            }else if(!creditIdea&&creditIdeaRemark){
              return creditIdeaRemark
            }else if(creditIdea&&creditIdeaRemark){
              return `${creditIdea},${creditIdeaRemark}`
            }else{
              return ''
            }
          }
        },
        {
          name: __this.languagePack["data"]["status"],
          reflect: "status",
          type: "mark",
          markColor: {
            "1": "#ec971f",
            "2": "#108ee9",
            "3": "#d9534f",
            "4": "#d9534f"
          },
          filter: item => {
            const status = item["status"];
            let name = reviewOrderStatustransform(status);
            return name;
          }
        }
      ],
      loading: false,
      showIndex: true,
      btnGroup: {
        title: __this.languagePack["common"]["operate"]["name"],
        data: [
          {
            textColor: "#80accf",
            name: __this.languagePack["common"]["btnGroup"]["a"],
            // ico : "anticon anticon-pay-circle-o" ,
            showContion: {
              name: "status",
              value: [1, 2, 3, 4, 5]
            },
            bindFn: item => {
              this.goAuditDetail(item);
            }
          }
        ]
      }
    };
    this.getRecordList();
  }
  userId: string = "";
  totalSize: number = 0;
  getRecordList() {
    this.tableData.loading = true;
    let data = this.searchModel;
    let applyDateEnd = DateObjToString(<Date>data.applyDateEnd);
    data.applyDateBegin = DateObjToString(<Date>data.applyDateBegin);
    data.applyDateEnd = applyDateEnd && applyDateEnd.indexOf(":") == -1 ? applyDateEnd + " 23:59:59" : applyDateEnd;
    let approveEffectDayEnd = DateObjToString(<Date>data.approveEffectDayEnd);
    data.approveEffectDayBegin = DateObjToString(<Date>data.approveEffectDayBegin);
    data.approveEffectDayEnd =
      approveEffectDayEnd && approveEffectDayEnd.indexOf(":") == -1
        ? approveEffectDayEnd + " 23:59:59"
        : approveEffectDayEnd;
    this.service
      .getAuditList(data)
      .pipe(
        filter((res: Response) => {
          console.log(res);
          if (res.success !== true) {
            this.msg.fetchFail(res.message);
          }

          this.tableData.loading = false;

          if (res.data === null || (res.data && res.data["length"] === 0)) {
            this.tableData.data = [];
            this.totalSize = 0;
          }

          return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
        })
      )
      .subscribe((res: Response) => {
        if (res["success"] && res["data"]["length"] !== 0) {
          let data_arr = res.data;
          this.tableData.data = <Array<Object>>data_arr;
          this.totalSize = res.page.totalNumber;
        }
      });
  }

  pageChange($size: number, type: string): void {
    if (type == "size") {
      this.searchModel.pageSize = $size;
    }

    if (type == "page") {
      this.searchModel.currentPage = $size;
    }
    this.getRecordList();
  }

  reset() {
    this.searchModel = new SearchModel();
    this.getRecordList();
  }

  search() {
    this.searchModel.currentPage = 1;
    this.getRecordList();
  }

  goSignin() {
    if (this.isAllocate === 2) {
      this.msg.operateFail("今日签到已结束");
      return false;
    }
    this.service.goSignin().subscribe((res: Response) => {
      if (res.success) {
        this.querySiginStatus();
      } else {
        this.msg.fetchFail(res.message);
      }
    });
  }
  goSignout() {
    this.service.goSignOut().subscribe((res: Response) => {
      if (res.success) {
        this.querySiginStatus();
      } else {
        this.msg.fetchFail(res.message);
      }
    });
  }
  goAuditDetail(item) {
    let that = this;
    if (item.status === 1) {
      //待审核 code 为9 刷新接口
      this.service.lockOrder(item.id).subscribe((res: Response) => {
        if (res.success) {
          that.router.navigate(["/usr/auth"], {
            queryParams: {
              from: "riskList",
              status: item["status"],
              usrId: item["userId"],
              order: item["id"],
              applyMoney: item["applyMoney"]
            }
          });
        } else {
          that.msg.fetchFail(res.message);
          if (res.code == 9) {
            that.getRecordList();
          }
        }
      });
    } else {
      this.router.navigate(["/usr/auth"], {
        queryParams: {
          from: "riskList",
          status: item["status"],
          usrId: item["userId"],
          order: item["id"],
          applyMoney: item["applyMoney"],
          auditMoney: item["auditMoney"]
        }
      });
    }
  }
  //查询信审人员签到状态
  querySiginStatus() {
    this.service.querySiginStatus().subscribe((res: Response) => {
      console.log(res);
      if (res["success"] !== true) {
        this.msg.fetchFail(res.message);
      }
      if (res["success"] && res["data"] && res["data"]["length"] !== 0) {
        if (res["data"]["riskAuditDate"]) {
          let riskAuditDateStr = unixTime(res["data"]["riskAuditDate"], "y-m-d");
          res["data"]["riskAuditDateStr"] = riskAuditDateStr;
        }
        this.siginData = res["data"];
        this.isSignin = res["data"]["signInState"];
        this.isAllocate = res["data"]["allocateState"];
        console.log(this.siginData);
        // this.siginData={
        //     allocateState:0,
        //     amAllocateBeginTime:"8:00",
        //     amAllocateEndTime :"10:00",
        //     canSignIn :true,
        //     pmAllocateBeginTime :"14:00",
        //     pmAllocateEndTime :"17:00",
        //     residueBeginAllocateDate :"1小时",
        //     riskAuditDate :"2018-12-25",
        //     signInState :0
        // };
        // this.isSignin=1;
        // this.isAllocate=0;
        // console.log(this.isSignin);
        // console.log(this.isAllocate);
      }
    });
  }
  goAttendance() {
    this.router.navigate(["/risk/riskAttendance"], {
      queryParams: {
        isCommon: true
      }
    });
  }
}
