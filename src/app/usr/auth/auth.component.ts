import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { TableData } from "../../share/table/table.model";

import { UserListService } from "../../service/user";
import { CommonMsgService } from "../../service/msg/commonMsg.service";
import { Response } from "../../share/model/reponse.model";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { filter } from "rxjs/operators";
import { Router } from "@angular/router";
import { SessionStorageService } from "../../service/storage";
import { ActivatedRoute } from "@angular/router";
import { AuthComponent } from "../../share/auth/auth.component";
import { OrderService, UserService } from "../../service/order";

@Component({
  selector: "usr-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.less"]
})
export class UsrAuthComponent implements OnInit {
  constructor(
    private translateSer: TranslateService,
    private msg: CommonMsgService,
    private fb: FormBuilder,
    private routerInfo: ActivatedRoute,
    private service: UserListService,
    private sgo: SessionStorageService,
    private orderSer: OrderService,
    private router: Router
  ) {}
  ngOnInit() {
    this.getLanguage();
    this.orderInfo = this.sgo.get("orderInfo");
    this.loginInfo = this.sgo.get("loginInfo");
    this.routerInfo.queryParams.subscribe(para => {
      this.para = para;
      this.authComponent.getData(this.para["usrId"], this.para["order"]);
      if (para.from == "riskList") {
        this.initRiskForm();
        this.initPassForm();
      }
    });

    let menuInfo = this.sgo.get("menuInfo")["children"];

    menuInfo.forEach((item, idx) => {
      let description = item["menuDescriptions"][0]["description"];
      if (description.indexOf("撤回") > -1) {
        this.permission = true;
      }
    });
  }

  para: Object;

  permission: boolean;

  orderInfo: Object;

  loginInfo: Object;

  @ViewChild("auth")
  authComponent: AuthComponent;

  riskForm: FormGroup;

  passForm: FormGroup;

  riskMark: boolean = false;
  passMark: boolean = false;

  initRiskForm() {
    this.riskForm = this.fb.group({
      status: [3],
      creditIdea: [null],
      creditIdeaRemark: [null],
      oldStatus: [null],
      createUserName: [null],
      userGrade: [null],
      creditOrderId: [null],
      creditOrderNo: [null]
    });
  }

  initPassForm() {
    this.passForm = this.fb.group({
      passVOS: this.fb.array([])
    });
  }

  add(times: number) {
    for (let i = 0; i < times; i++) {
      const control = <FormArray>this.passForm.controls["passVOS"];
      control.push(this.createContact(i));
    }
  }

  removeAt(times: number) {
    for (let i = 0; i < times; i++) {
      const control = <FormArray>this.passForm.controls["passVOS"];
      control.removeAt(i);
    }
  }

  createContact(index: number) {
    let pro = this.product_enum[index];
    let createUserName = this.loginInfo["description"];
    return this.fb.group({
      status: [2],
      approveAmountMax: [null],
      approveAmountMin: [null],
      productId: [pro["id"]],
      createUserName: [createUserName],
      creditOrderNo: [null],
      loanProductType: [pro["loanProductType"]]
    });
  }

  get passVOS(): FormArray {
    return this.passForm.get("passVOS") as FormArray;
  }

  closeOrder() {
    this.passMark = false;
    this.removeAt(this.product_enum["length"]);
  }

  showTreat: boolean = false;
  showRefuse: boolean = false;
  classe: string; //用户等级，spc查询，默认为F
  showModal(modal: string, back: boolean, oper: string) {
    this.getProductList();
    this.classe = this.authComponent.classe;
    this.showTreat = false;
    this.showRefuse = false;
    let status = "";

    let msg = this.languagePack["common"]["tips"]["invalidOper"];

    if ((oper === "pass" || oper === "refuse") && this.para["status"] != 1) {
      this.msg.operateFail(msg);
      return;
    }

    if (oper === "retreat" && this.para["status"] != 2) {
      this.msg.operateFail(msg);
      return;
    }

    if (oper === "pass" && this.para["status"] == 1) {
      status = "2";
    }

    if (oper === "refuse" && this.para["status"] == 1) {
      status = "9";
      this.showRefuse = true;
    }

    if (oper === "retreat" && this.para["status"] != 1) {
      status = "9";
      this.showTreat = true;
    }

    if (modal === "risk") this.showRiskModel(status);
  }

  showRiskModel(back) {
    if (back === "2") {
      //pass
      this.passMark = true;
      return false;
    }
    this.riskForm.reset();

    this.riskMark = true;
    let createUserName = this.loginInfo["description"];
    let obj = {};
    obj["oldStatus"] = this.para["status"];
    obj["creditOrderId"] = this.para["order"];
    obj["creditOrderNo"] = this.para["orderNo"];
    obj["status"] = 3;
    obj["createUserName"] = createUserName;
    obj["userGrade"] = this.classe;
    this.riskForm.patchValue(obj);
  }
  languagePack: Object;
  getLanguage() {
    this.translateSer
      .stream(["common", "orderList", "reviewRiskList"])
      .subscribe(data => {
        this.languagePack = {
          common: data["common"],
          order: data["orderList"],
          reviewRiskList: data["reviewRiskList"]
        };

        this.refuse_enum = this.languagePack["order"]["allList"]["enum"][
          "refuse"
        ];
        this.retreat_enum = this.languagePack["order"]["allList"]["enum"][
          "retreat"
        ];
        this.onePro_enum = this.languagePack["reviewRiskList"]["passModule"][
          "oneProductList"
        ];
        this.twoPro_enum = this.languagePack["reviewRiskList"]["passModule"][
          "twoProductList"
        ];
      });
  }
  makeOrderCheck($event, type) {
    let el = <HTMLButtonElement>$event.target;
    if (type === "pass") {
      let flag = this.checkPassLoanQuota(this.passForm.value.passVOS);
      if (flag) {
        let passVOS = this.passForm.value.passVOS;
        let createUserName = this.loginInfo["description"];
        let postObj = {
          productVOList: [],
          status: null,
          creditOrderId: this.para["order"],
          creditOrderNo: this.para["orderNo"],
          result: 1,
          createUserName: createUserName,
          userGrade: this.classe
        };
        passVOS.forEach((v, i) => {
          let item = {
            approveAmountMax: v.approveAmountMax,
            approveAmountMin: v.approveAmountMin,
            productId: v.productId,
            loanProductType: v.loanProductType
          };
          postObj.status = v.status;
          postObj.productVOList.push(item);
        });
        el.disabled = true;
        this.passFetch(postObj, el);
      }
      return false;
    }
    let postData = this.riskForm.value;
    //审批原因不能为空
    if (postData.status === 3 && !postData.creditIdea) {
      let msg = this.languagePack["common"]["tips"]["notEmpty"];
      this.msg.operateFail(msg);
      return;
    }
    //拒绝原因为其他时 必填备注
    if (postData["creditIdea"] == 7 && !postData["creditIdeaRemark"]) {
      this.msg.operateFail(this.languagePack["common"]["tips"]["inputMark"]);
      return false;
    }
    postData["creditIdea"] = Number(postData["creditIdea"]);
    el.disabled = true;
    if (postData.oldStatus === "2") {
      // 撤回订单到拒绝
      this.resetFetch(postData, el);
    } else {
      postData["result"] = 0;
      // 审批拒绝订单
      this.passFetch(postData, el);
    }
  }

  passFetch(postData: object, el: any) {
    this.orderSer
      .riskOper(postData)
      .pipe(
        filter((res: Response) => {
          if (res.success === false) {
            this.msg.operateFail(res.message);
          }
          el.disabled = false;
          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        this.riskMark = false;
        if ( this.para['admin'] ) {
          this.router.navigate(["/risk/deskAdmin"]);
        } else {
          this.router.navigate(["/risk/operPlatCommon"]);
        }
      });
  }
  resetFetch(postData: object, el: any) {
    this.orderSer
      .rebackOrder(postData)
      .pipe(
        filter((res: Response) => {
          if (res.success === false) {
            this.msg.operateFail(res.message);
          }
          el.disabled = false;
          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        this.riskMark = false;
        if ( this.para['admin'] ) {
          this.router.navigate(["/risk/deskAdmin"]);
        } else {
          this.router.navigate(["/risk/operPlatCommon"]);
        }
      });
  }

  refuse_enum: Array<Object>;

  retreat_enum: Array<Object>;

  onePro_enum: Array<Object>;

  twoPro_enum: Array<Object>;

  product_enum: Array<Object> = [];

  //通过用户等级获取产品列表
  getProductList() {
    this.classe = this.authComponent.classe || "F";
    console.log(this.authComponent.classe, "classe");
    console.log(this.classe, "this.classe");
    this.orderSer.productList(this.classe).subscribe((res: Response) => {
      if (res.success) {
        (<Array<object>>res.data).forEach((k, i) => {
          k["loanProductTypeStr"] =
            k["loanProductType"] === 1 ? "一次性还本付息" : "分期";
          k["loanQuotaStr"] = `${k["loanQuotaMix"]}~${k["loanQuotaMax"]}`;
          k["loanTermStr"] = `${k["loanTermMix"]}~${k["loanTermMax"]}(${
            k["loanTermType"] === 1 ? "日" : "月"
          })`;
          k["loanRate"] = `${(k["loanRate"] * 100).toFixed(2)}%`;
          k["overDueFine"] = `${(k["overDueFine"] * 100).toFixed(2)}%`;
          k["overDueFineDelay"] = `${(k["overDueFineDelay"] * 100).toFixed(
            2
          )}%`;
        });
        this.product_enum = <Array<object>>res.data;
        console.log("product_enum", this.product_enum);
        if (res.data["length"]) {
          this.add(res.data["length"]);
        }
      } else {
        this.msg.fetchFail(res.message);
      }
    });
    // let arr = [{id:1001, loanProductType:1, loanQuotaMax:2000, loanQuotaMix: 500 , loanTermType: 1, loanTermMix: 7, loanTermMax: 28}, {id:1002, loanProductType:2, loanQuotaMax:3000, loanQuotaMix: 100, loanTermType: 2, loanTermMix: 3, loanTermMax: 6}];
    // arr.forEach((k, i)=>{
    //     k['loanQuotaStr'] = `${k.loanQuotaMix}~${k.loanQuotaMax}`;
    //     k['loanTermStr'] = `${k.loanTermMix}~${k.loanTermMax}(${k.loanTermType === 1 ? '日' : '月'})`;
    // })
    // this.product_enum = arr
  }

  checkPassLoanQuota(passVOS: Array<object>) {
    let err1 = this.languagePack["reviewRiskList"]["passModule"]["err1"];
    let err2 = this.languagePack["reviewRiskList"]["passModule"]["err2"];
    let err3 = this.languagePack["reviewRiskList"]["passModule"]["err3"];
    let flag = true;
    for (var i = 0; i < this.product_enum.length; i++) {
      for (var j = 0; j < passVOS.length; j++) {
        if (
          Number(passVOS[j]["approveAmountMax"]) >
          this.product_enum[j]["loanQuotaMax"]
        ) {
          flag = false;
          this.msg.operateFail(
            `${this.product_enum[i]["loanProductName"]}:${err1}`
          );
          // console.log('不能大于上线', this.product_enum[i]["loanProductName"]);
          break;
        } else if (
          Number(passVOS[j]["approveAmountMin"]) <
          this.product_enum[j]["loanQuotaMix"]
        ) {
          flag = false;
          this.msg.operateFail(
            `${this.product_enum[i]["loanProductName"]}:${err2}`
          );
          // console.log('不能小于下线', this.product_enum[i]["loanProductName"]);
          break;
        } else if (
          Number(passVOS[j]["approveAmountMax"]) <
          Number(passVOS[j]["approveAmountMin"])
        ) {
          flag = false;
          this.msg.operateFail(
            `${this.product_enum[i]["loanProductName"]}:${err3}`
          );
          // console.log('最大值不能小于最小值');
          break;
        }
      }
      if (!flag) {
        break;
      }
    }
    return flag;
  }
}
