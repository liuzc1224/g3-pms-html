import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { SearchModel } from "./searchModel";
import { Adaptor, ObjToArray } from "../../share/tool";
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
  templateUrl: "./desk.component.html",
  styleUrls: ["./desk.component.less"]
})
export class deskAdminComponent implements OnInit {
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

    this.getLanguage();

    this.validateForm = this.fb.group({
      orderStatus: [null, [Validators.required]]
    });
  }

  languagePack: Object;

  statusEnum: Array<Object>;

  validateForm: FormGroup;

  userLoginInfo: Object;

  roleShowPage: boolean = true;

  creditOrderNo: string;

  roleInitPage() {
    if (this.userLoginInfo && this.userLoginInfo != "undefined") {
      this.userLoginInfo["roleOutputBOS"];
      this.userLoginInfo["roleOutputBOS"].forEach((item, index) => {
        if (item["id"] === 13) {
          this.roleShowPage = false;
          return;
        }
      });
    }
  }

  getLanguage() {
    this.translateSer.stream(["common", "reviewRiskList.tableModule"]).subscribe(data => {
      this.languagePack = {
        common: data["common"],
        data: data["reviewRiskList.tableModule"]
      };
      this.statusEnum = data["common"]["reviewOrderStatus"];

      this.userLoginInfo = this.sgo.get("loginInfo");

      this.roleInitPage();

      this.initialTable();
    });
  }

  searchModel: SearchModel = new SearchModel();
  private searchCondition: Object = {
    status: false
  };

  changeStatus(status: string) {
    this.searchModel.status = status;
    this.searchModel.currentPage = 1;
    this.getRecordList();
  }

  tableData: TableData;
  allotList: Array<Number> = [];

  initialTable() {
    this.tableData = {
      tableTitle: [
        {
          name: "选择",
          reflect: "orderNo",
          type: "checkbox",
          fn: item => {
            if (item.isSelect == false) {
              // 取消选择
              this.allotList.splice(this.allotList.indexOf(item.id), 1);
            } else {
              // 选择
              this.allotList.push(item.id);
            }
          },
          checkAll: choose => {
            if (choose) {
              // 全选
              this.allotList = [];
              this.tableData.data.forEach((item, index) => {
                if (!item["disabled"]) {
                  item["isSelect"] = true;
                  this.allotList.push(item["id"]);
                }
              });
            } else {
              // 取消全选
              this.tableData.data.forEach((item, index) => {
                item["isSelect"] = false;
              });
              this.allotList = [];
            }
          }
        },
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
          //   filter: item => {
          //     const creditIdea = item["creditIdea"];
          //     const creditIdeaRemark = item["creditIdeaRemark"];
          //     if (creditIdea == 7) {
          //       return creditIdeaRemark;
          //     } else {
          //       return creditIdea;
          //     }
          //   }
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
              this.sgo.set("orderInfo", item.id);
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
                        admin: true,
                        applyMoney: item["applyMoney"],
                        auditMoney: item["auditMoney"],
                        orderNo: item["creditOrderNo"]
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
                    admin: true,
                    applyMoney: item["applyMoney"],
                    auditMoney: item["auditMoney"],
                    orderNo: item["creditOrderNo"]
                  }
                });
              }
            }
          },
          {
            textColor: "#80accf",
            name: __this.languagePack["common"]["btnGroup"]["reviewRecord"],
            // ico : "anticon anticon-pay-circle-o" ,
            showContion: {
              name: "status",
              value: [1, 2, 3, 4, 5]
            },
            bindFn: item => {
              this.getCreditOrderRecord(item["id"]);
              this.makeLoanMark = true;
              this.creditOrderNo = item["creditOrderNo"];
              console.log(item);
            }
          }
        ]
      }
    };
    this.getRecordList();
  }

  selectItem: object;
  totalSize: number = 0;
  makeLoanMark: boolean = false;
  allotModal: boolean = false;
  noteMark: boolean = false;
  remark: string = "";
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

    let sort = ObjToArray(this.searchCondition);
    data.columns = sort.keys;
    data.orderBy = sort.vals;
    if (!this.roleShowPage) {
      data.status = "1";
    }
    this.service
      .getRecordList(data)
      .pipe(
        filter((res: Response) => {
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
        let data_arr = <Array<Object>>res.data;

        data_arr.forEach((item, index) => {
          item["isSelect"] = false;
          if (item["status"] == 1) {
            item["disabled"] = false;
          } else {
            item["disabled"] = true;
          }
        });

        this.tableData.data = <Array<Object>>data_arr;

        this.allotList = [];

        this.totalSize = res.page.totalNumber;
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

  exportRisk() {
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

    let sort = ObjToArray(this.searchCondition);
    data.columns = sort.keys;
    data.orderBy = sort.vals;
    // window.location.href = 'http://10.0.52.44:8301/creditOrder/export';
    this.service.exportRisk(data).subscribe(res => {
      let blob = new Blob([res], { type: "application/vnd.ms-excel" });
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute("style", "display:none");
      a.setAttribute("href", objectUrl);
      a.setAttribute("download", "风控列表");
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
  //信审记录
  recordData: Array<Object> = [];
  getCreditOrderRecord(orderId) {
    this.service
      .getCreditOrderRecord(orderId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.msg.fetchFail(res.message);
          }

          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        this.recordData = <Array<Object>>res.data;
      });
  }
  riskEmployees: Array<object>;
  allot() {
    this.allotModal = true;
    this.service
      .getRiskEmployees()
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.msg.fetchFail(res.message);
          }

          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        this.riskEmployees = <Array<object>>res.data;
      });
  }
  goAttendance() {
    this.router.navigate(["/risk/riskAttendance"], {
      queryParams: {
        isCommon: false
      }
    });
  }

  makeNew() {
    this.allotModal = false;
    let postData = {
      employeeId: this.validateForm.value["orderStatus"],
      creditOrderIds: this.allotList
    };
    this.service
      .setAllocation(postData)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.msg.fetchFail(res.message);
          }

          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        this.msg.operateSuccess();
        this.getRecordList();
      });
  }
}
