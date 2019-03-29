import { Component, Input } from "@angular/core";
import { RecordService } from "../../service/order";
import { TranslateService } from "@ngx-translate/core";
import { CommonMsgService } from "../../service/msg/commonMsg.service";
import { Response } from "../../share/model/reponse.model";
import { SearchModel } from "./searchModel";
import { Router } from "@angular/router";
import { orderStatustransform } from "../../format";
import { DateObjToString } from "../../format";

@Component({
  selector: "record",
  templateUrl: "./record.component.html",
  styleUrls: ["./record.component.less"]
})
export class RecordComponent {
  @Input() type: string;
  constructor(
    private translateSer: TranslateService,
    private msg: CommonMsgService,
    private recordSer: RecordService,
    private router: Router
  ) {}

  userId: number;
  orderList;
  askList;
  SearchModel: SearchModel = new SearchModel();
  languagePack: Object;
  statusEnum: Array<{ name: string; value: number }>;
  pageNumber: any = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  ngOnInit() {
    this.getLanguage();
  }
  getLanguage() {
    this.translateSer
      .stream(["orderList.allList", "common"])
      .subscribe(data => {
        this.languagePack = {
          common: data["common"],
          data: data["orderList.allList"]
        };

        this.statusEnum = data["orderList.allList"]["loanStatus"];
      });
  }
  getData(userId: number) {
    this.userId = userId;
    // this.SearchModel.userId = userId;
    this.getOrderList();
  }

  getAskData(userId: number) {
    this.userId = userId;
    this.SearchModel.userId = userId;
    this.getAskList();
  }

  goDetail(item: object) {
    this.router.navigate(["/order/detail"], {
      queryParams: {
        order: item["id"],
        userId: item["userId"],
        loanStatus: orderStatustransform(item["status"])
      }
    });
  }

  orderDtail: Object;

  getBasicInfo(orderId: number) {
    this.recordSer.getBasicInfo(orderId).subscribe((res: Response) => {
      this.orderDtail = res.data;
    });
  }

  getOrderList() {
    let data = this.SearchModel;
    if (data.status == "null") {
      data.status = "3,4,6,13";
    }
    data.userId = this.userId;
    let etime = DateObjToString(<Date>data.applyCashDateEnd);
    data.applyCashDateStart = DateObjToString(<Date>data.applyCashDateStart);
    data.applyCashDateEnd =
      etime && etime.indexOf(":") == -1 ? etime + " 23:59:59" : etime;
    this.recordSer.getOrderListInfo(data).subscribe(res => {
      // res={
      //     success:true,
      //     data:[
      //         {status:3,payDate:1234654},
      //         {status:3,payDate:null}
      //     ]
      // };
      if (res["success"] !== true) {
        this.msg.fetchFail(res["message"]);
      }
      if (res["data"] && res["success"]) {
        for (let i = 0; i < res["data"]["length"]; i++) {
          switch (res["data"][i]["status"]) {
            case 3: {
              res["data"][i]["statusTxt"] = this.languagePack["data"][
                "loanStatus"
              ][0]["name"]; //放款中
              break;
            }
            case 4: {
              res["data"][i]["statusTxt"] = this.languagePack["data"][
                "loanStatus"
              ][1]["name"]; //待还款
              break;
            }
            case 6: {
              res["data"][i]["statusTxt"] = this.languagePack["data"][
                "loanStatus"
              ][2]["name"]; //已完成
              break;
            }
            case 13: {
              res["data"][i]["statusTxt"] = this.languagePack["data"][
                "loanStatus"
              ][3]["name"]; //放款失败
              break;
            }
          }
        }
        for (let i = 0; i < res["data"]["length"]; i++) {
          switch (res["data"][i]["orderType"]) {
            case 0: {
              res["data"][i]["orderTypeTxt"] = this.languagePack["common"][
                "orderTypeTxt"
              ][0]; //一次性还款付清
              break;
            }
            case 1: {
              res["data"][i]["orderTypeTxt"] = this.languagePack["common"][
                "orderTypeTxt"
              ][1]; //分期等额还款
              break;
            }
          }
        }
        this.orderList = res["data"];
        if (res["page"]) {
          this.pageNumber = res["page"]["totalNumber"];
          this.currentPage = res["page"]["currentPage"];
        }
      }
    });
  }

  getAskList() {
    let data = this.SearchModel;
    this.recordSer.getOrderListInfo(data).subscribe((res: Response) => {
      this.askList = res.data;
    });
  }
  changeStatus(status: string) {
    this.SearchModel.status = status;
    this.SearchModel.currentPage = 1;
    this.getOrderList();
  }
  search() {
    this.SearchModel.currentPage = 1;
    this.getOrderList();
  }
  reset() {
    this.SearchModel = new SearchModel();
    this.getOrderList();
  }
  changePage(reset: boolean = false) {
    console.log(reset);
    if (reset) {
      this.currentPage = 1;
    }
    console.log(this.currentPage);
    this.getOrderList();
  }
}
