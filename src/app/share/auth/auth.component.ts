import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "../../service/order";
import { filter } from "rxjs/operators";
import { CommonMsgService } from "../../service/msg";
import { Response } from "../model";
import { TableData } from "../../share/table/table.model";
import { unixTime, reviewOrderStatustransform } from "../../format";

declare var $: any;
@Component({
  selector: "auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.less"]
})
export class AuthComponent {
  constructor(
    private translate: TranslateService,
    private usrSer: UserService,
    private msg: CommonMsgService
  ) {}

  userId: number;
  orderId: number;

  languagePack: Object;

  detailinfo: Object;

  getData(userId: number, orderId: number) {
    this.userId = userId;
    this.orderId = orderId;
    this.getDetailinfo();
    this.getAuth();
    this.getLanguage();
  }

  getLanguage() {
    this.translate
      .stream([
        "financeModule.list",
        "common",
        "riskModule",
        "orderList.allList.table",
        "reviewRiskList.tableModule"
      ])
      .subscribe(data => {
        this.languagePack = {
          common: data["common"],
          data: data["financeModule.list"],
          risk: data["riskModule"],
          orderList: data["orderList.allList.table"],
          recordList: data["reviewRiskList.tableModule"]
        };

        this.initialTable();
        this.initialRecordTable();
      });
  }

  photoInfo: Object;

  isShowCall: boolean = false;
  isBigImg: boolean = false;
  classe: string; //用户等级，spc查询，默认为F
  getDetailinfo() {
    let userId = this.userId;
    let serType = this.orderId ? "getOrderDetailinfo" : "getDetailinfo";
    let data = {
      orderId: this.orderId
    };
    this.usrSer[serType](userId, data).subscribe((res: Response) => {
      if (res.success) {
        this.detailinfo = res.data;
        this.classe = res.data["spcScoreVO"].length
          ? res.data["spcScoreVO"][0]["classe"]
          : null;
        console.log(this.detailinfo);
      } else {
        this.msg.fetchFail(res.message);
      }
    });
  }

  getAuth() {
    let serType = this.orderId ? "getOrderAuth" : "getAuth";
    let data = {
      orderId: this.orderId
    };

    this.usrSer[serType](this.userId, data).subscribe((res: Response) => {
      this.photoInfo = res.data;
      setTimeout(() => {
        $("[data-magnify=gallery]").magnify();
      }, 20);
    });
  }

  showCallList() {
    let flag = this.friendInfo.callList.length ? true : false;
    this.isShowCall = flag;
  }

  hideMask() {
    this.isShowCall = false;
  }
  //人际关系
  friendInfo = {
    title: "Relación",
    trChild: [],
    callList: []
  };

  showImg(index) {
    $("[data-magnify=gallery]")[index].click();
  }

  //获取历史订单
  getOrderHisList() {
    this.usrSer.getOrderHisList(this.userId).subscribe((res: Response) => {
      if (res.success) {
        this.tableData.data = <Array<Object>>res.data;
        console.log(res);
      } else {
        this.msg.fetchFail(res.message);
      }
    });
  }

  tableData: TableData;
  //历史借款订单
  initialTable() {
    let __this = this;
    this.tableData = {
      tableTitle: [
        {
          name: __this.languagePack["data"]["table"]["creditOrderNo"],
          reflect: "creditOrderNo",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["table"]["orderNo"],
          reflect: "orderNo",
          type: "text"
        },
        {
          name: __this.languagePack["orderList"]["createTime"],
          reflect: "createTime",
          type: "text",
          filter: item => {
            return unixTime(item.createTime, "y-m-d h:i:s");
          }
        },
        {
          name: `${__this.languagePack["data"]["table"]["loanMount"]}`,
          reflect: "auditMoney",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["table"]["limit"] + "(天)",
          reflect: "loanDays",
          type: "text"
        },
        {
          name: __this.languagePack["orderList"]["currentRealRepay"],
          reflect: "currentRealRepay",
          type: "text",
          filter: item => {
            let currentRealRepay = item["currentRealRepay"];
            if (currentRealRepay) {
              currentRealRepay = currentRealRepay.toFixed(2);
            }
            return currentRealRepay;
          }
        },
        {
          name: __this.languagePack["orderList"]["realRepayMoney"],
          reflect: "realRepayMoney",
          type: "text"
        },
        {
          name: __this.languagePack["orderList"]["dueDay"],
          reflect: "dueDays",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["table"]["orderStatus"],
          reflect: "status",
          type: "mark",
          markColor: {
            "1": "#ec971f",
            "2": "#108ee9",
            "9": "#d9534f",
            "12": "#d9534f"
          },
          filter: item => {
            const status = item["status"];

            const map = __this.languagePack["risk"]["searchTabStatus1"];

            let name = [];

            map.map((ele, index) => {
              ele.value.forEach(element => {
                if (element == status) {
                  name.push(ele);
                  return false;
                }
              });
            });
            return name && name[0].name ? name[0].name : "no";
          }
        },
        {
          name: __this.languagePack["data"]["table"]["comment"],
          reflect: "comment",
          type: "text"
        }
      ],
      loading: false,
      showIndex: true
    };
    this.getOrderHisList();
  }

  recordTableData: TableData;
  //历史信审订单
  initialRecordTable() {
    let __this = this;
    this.recordTableData = {
      tableTitle: [
        {
          name: __this.languagePack["recordList"]["applyDateStr"],
          reflect: "applyDateStr",
          type: "text"
        },
        {
          name: __this.languagePack["recordList"]["creditOrderNo"],
          reflect: "creditOrderNo",
          type: "text"
        },
        {
          name: __this.languagePack["recordList"]["userPhone"],
          reflect: "userPhone",
          type: "text"
        },
        {
          name: __this.languagePack["recordList"]["userGrade"],
          reflect: "userGrade",
          type: "text"
        },
        {
          name: __this.languagePack["recordList"]["approveAmount"],
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
          name: __this.languagePack["recordList"]["fapproveAmount"],
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
          name: __this.languagePack["recordList"]["approveDays"],
          reflect: "approveDays",
          type: "text"
        },
        {
          name: __this.languagePack["recordList"]["approveEffectDay"],
          reflect: "approveEffectDayStr",
          type: "text"
        },
        {
          name: __this.languagePack["recordList"]["approveExpDay"],
          reflect: "approveExpDayStr",
          type: "text"
        },
        {
          name: __this.languagePack["recordList"]["adminName"],
          reflect: "adminName",
          type: "text"
        },
        {
          name: __this.languagePack["recordList"]["creditIdea"],
          reflect: "creditIdea",
          type: "text",
          filter: item => {
            const creditIdea = item["creditIdea"];
            const creditIdeaRemark = item["creditIdeaRemark"];
            if (creditIdea == 7) {
              return creditIdeaRemark;
            } else {
              return creditIdea;
            }
          }
        },
        {
          name: __this.languagePack["recordList"]["status"],
          reflect: "status",
          type: "mark",
          markColor: {
            "1": "#ec971f",
            "2": "#108ee9",
            "9": "#d9534f",
            "12": "#d9534f"
          },
          filter: item => {
            const status = item["status"];
            let name = reviewOrderStatustransform(status);
            return name;
          }
        }
      ],
      loading: false,
      showIndex: true
    };
    this.getRecordList();
  }

  getRecordList() {
    this.usrSer
      .getRecordList(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.msg.fetchFail(res.message);
          }

          return (
            res.success === true &&
            res.data &&
            (<Array<Object>>res.data).length >= 0
          );
        })
      )
      .subscribe((res: Response) => {
        this.recordTableData.data = <Array<Object>>res.data;
      });
  }
}
