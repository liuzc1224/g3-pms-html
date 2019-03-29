import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TableData } from "../../share/table/table.model";
import { CommonMsgService } from "../../service/msg";
import { Router } from "@angular/router";
import { SessionStorageService } from "../../service/storage";

let __this;

@Component({
  selector: "",
  templateUrl: "./contract.component.html",
  styleUrls: ["./contract.component.less"]
})
export class ContractComponent implements OnInit {
  constructor(
    private translateSer: TranslateService,
    private msg: CommonMsgService,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder
  ) {}

  languagePack: Object;
  tableData: TableData;

  ngOnInit() {
    __this = this;
    this.getLanguage();
  }

  getLanguage() {
    this.translateSer.stream(["coupon.list", "common"]).subscribe(data => {
      this.languagePack = {
        common: data["common"],
        list: data["coupon.list"]
      };
    });
  }

  initialTable() {
    this.tableData = {
      loading: false,
      showIndex: false,
      tableTitle: [
        {
          name: __this.languagePack["list"]["channelId"],
          reflect: "id",
          type: "text"
        },
        {
          name: __this.languagePack["list"]["channelProvider"],
          reflect: "name",
          type: "text"
        },
        {
          name: __this.languagePack["list"]["link"],
          reflect: "link",
          type: "text"
        },
        {
          name: __this.languagePack["list"]["channelStatus"],
          reflect: "state",
          type: "text",
          filter: item => {
            let name;
            const status = item["state"];
            switch (status) {
              case 1: {
                name = __this.languagePack["data"]["channelStatus"]["open"];
                break;
              }
              case 0: {
                name = __this.languagePack["data"]["channelStatus"]["disable"];
                break;
              }
            }
            return name ? name : "";
          }
        }
      ],
      btnGroup: {
        title: __this.languagePack["common"]["operate"]["name"],
        data: [
          {
            textColor: "#0000ff",
            name: __this.languagePack["common"]["operate"]["name"],
            bindFn: item => {
              // this.isVisible=true;
              // this.validForm.patchValue({
              //   id: item.id,
              //   name:item.name,
              //   link:item.link,
              //   state:item.state
              // });
            }
          }
        ]
      }
    };
  }
}
