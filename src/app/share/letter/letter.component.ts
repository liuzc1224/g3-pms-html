import { Component, Input } from "@angular/core";
import { RecordService } from "../../service/order";
import { TranslateService } from "@ngx-translate/core";
import { CommonMsgService } from "../../service/msg/commonMsg.service";
import { Response } from "../../share/model/reponse.model";
import { SearchModel } from "./searchModel";
import { Router } from "@angular/router";
import { orderStatustransform } from "../../format";
import { DateObjToString } from "../../format";

let __this;
@Component({
  selector: "letter",
  templateUrl: "./letter.component.html",
  styleUrls: ["./letter.component.less"]
})
export class letterComponent {
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

        this.statusEnum = data["common"]["reviewOrderStatus"];
      });
  }
  getData(userId: number) {
    this.userId = userId;
    // this.SearchModel.userId = userId;
    this.getOrderList();
  }

  getOrderList() {
    let data = this.SearchModel;
    let etime = DateObjToString(<Date>data.applyDateEnd);
    data.applyDateBegin = DateObjToString(<Date>data.applyDateBegin);
    data.applyDateEnd =
      etime && etime.indexOf(":") == -1 ? etime + " 23:59:59" : etime;
    data["userIds"] = [this.userId];
    console.log(data);
    this.recordSer.getLetterListInfo(data).subscribe((res: Response) => {
      console.log(res);
      if (res.success !== true) {
        this.msg.fetchFail(res.message);
      }
      if (res.data && res.success) {
        for (let i = 0; i < res.data["length"]; i++) {
          switch (res.data[i]["status"]) {
            case 1: {
              res.data[i]["statusTxt"] = this.statusEnum[0]["name"];
              break;
            }
            case 2: {
              res.data[i]["statusTxt"] = this.statusEnum[1]["name"];
              break;
            }
            case 3: {
              res.data[i]["statusTxt"] = this.statusEnum[2]["name"];
              break;
            }
            case 4: {
              res.data[i]["statusTxt"] = this.statusEnum[3]["name"];
              break;
            }
            case 5: {
              res.data[i]["statusTxt"] = this.statusEnum[4]["name"];
              break;
            }
          }
        }
        this.orderList = res.data;
      }
      if (res.page) {
        this.pageNumber = res.page["totalNumber"];
        this.currentPage = res.page["currentPage"];
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
