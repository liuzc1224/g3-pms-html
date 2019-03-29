import {Component, OnInit} from '@angular/core';
import {dataFormat, DateObjToString} from '../../format';
import {SearchModel} from './searchModel';
import {TableData} from '../../share/table/table.model';
import {CommonMsgService} from '../../service/msg/commonMsg.service';
import {Response} from '../../share/model/reponse.model';
import {filter} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {channelDataService} from '../../service/report';

let __this;

@Component({
  selector: '',
  templateUrl: './channeldata.component.html',
  styleUrls: ['./channeldata.component.less']
})
export class channeldataComponent implements OnInit {

  constructor(
    private msg: CommonMsgService,
    private translateSer: TranslateService,
    private service : channelDataService ,
  ) {
  };

  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  channelType:Array< String >;
  chType:number=1;
  ngOnInit() {
    __this = this;
    this.getLanguage();
  };

  totalSize: number = 0;
  tableData: TableData;

  getLanguage() {
    this.translateSer.stream(['reportModule.channeldata', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            data: data['reportModule.channeldata']['table'],
          };
          this.channelType=data['reportModule.channeldata']['channelType'];
          console.log(this.channelType);
          this.initialTable();
        }
      );
  }

  reset() {
    this.searchModel = new SearchModel;
    this.getList();
  };
  search() {
    this.searchModel.currentPage = 1 ;
    this.getList();
  };
  changeStatus(status: Number){
    console.log(status);
    if(status==1){
      this.chType=1;
      this.initialTable();
    }else{
      this.chType=2;
      this.initialTableH5()
    }
  }
  initialTable() {
    this.tableData = {
      loading: false,
      showIndex: false,
      tableTitle: [
        {
          name: __this.languagePack['data']['name'],
          reflect: 'name',
          type: 'text',
        }, {
          name: __this.languagePack['data']['channelBranchName'],
          reflect: 'channelBranchName',
          type: 'text',
        }, {
          name: __this.languagePack['data']['invitationCode'],
          reflect: 'invitationCode',
          type: 'text'
        }, {
          name: __this.languagePack['data']['registered'],
          reflect: 'registerCount',
          type: 'text'
        }, {
          name: __this.languagePack['data']['firstLoanApplication'],
          reflect: 'firstLoanApplyCount',
          type: 'text',
        }, {
          name: __this.languagePack['data']['firstLoanReviewPassed'],
          reflect: 'firstLoanAuditPassCount',
          type: 'text',
        }, {
          name: __this.languagePack['data']['firstLoanWithdrawal'],
          reflect: 'firstLoanCashCount',
          type: 'text',
        }, {
          name: __this.languagePack['data']['completeTheFirstLoan'],
          reflect: 'firstLoanFinishCount',
          type: 'text',
        }, {
          name: __this.languagePack['data']['completeTheSecondLoan'],
          reflect: 'secondLoanFinishCount',
          type: 'text',
        }, {
          name: __this.languagePack['data']['completeMultiLoan'],
          reflect: 'moreLoanFinishCount',
          type: 'text',
        }, {
          name: __this.languagePack['data']['successfulRepayment'],
          reflect: 'repayFinishCount',
          type: 'text',
        }, {
          name: __this.languagePack['data']['firstLoanOverdue'],
          reflect: 'firstLoanDueCount',
          type: 'text',
        }, {
          name: __this.languagePack['data']['M1IsOverdue'],
          reflect: 'm1Count',
          type: 'text',
        }, {
          name: __this.languagePack['data']['M2IsOverdue'],
          reflect: 'm2Count',
          type: 'text',
        }, {
          name: __this.languagePack['data']['M3IsOverdue'],
          reflect: 'm3Count',
          type: 'text',
        }
      ],
    };
    this.getList();
  };
  initialTableH5() {
    this.tableData = {
      loading: false,
      showIndex: false,
      tableTitle: [
        {
          name: __this.languagePack['data']['id'],
          reflect: 'id',
          type: 'text',
        }, {
          name: __this.languagePack['data']['channelName'],
          reflect: 'name',
          type: 'text',
        }, {
          name: __this.languagePack['data']['link'],
          reflect: 'link',
          type: 'text'
        }, {
          name: __this.languagePack['data']['download'],
          reflect: 'downloadCount',
          type: 'text'
        },{
          name: __this.languagePack['data']['registered'],
          reflect: 'registerCount',
          type: 'text'
        }, {
          name: __this.languagePack['data']['firstLoanApplication'],
          reflect: 'firstLoanApplyCount',
          type: 'text',
        }, {
          name: __this.languagePack['data']['firstLoanReviewPassed'],
          reflect: 'firstLoanAuditPassCount',
          type: 'text',
        }, {
          name: __this.languagePack['data']['firstLoanWithdrawal'],
          reflect: 'firstLoanCashCount',
          type: 'text',
        }, {
          name: __this.languagePack['data']['completeTheFirstLoan'],
          reflect: 'firstLoanFinishCount',
          type: 'text',
        }, {
          name: __this.languagePack['data']['completeTheSecondLoan'],
          reflect: 'secondLoanFinishCount',
          type: 'text',
        }, {
          name: __this.languagePack['data']['completeMultiLoan'],
          reflect: 'moreLoanFinishCount',
          type: 'text',
        }, {
          name: __this.languagePack['data']['successfulRepayment'],
          reflect: 'repayFinishCount',
          type: 'text',
        }, {
          name: __this.languagePack['data']['firstLoanOverdue'],
          reflect: 'firstLoanDueCount',
          type: 'text',
        }, {
          name: __this.languagePack['data']['M1IsOverdue'],
          reflect: 'm1Count',
          type: 'text',
        }, {
          name: __this.languagePack['data']['M2IsOverdue'],
          reflect: 'm2Count',
          type: 'text',
        }, {
          name: __this.languagePack['data']['M3IsOverdue'],
          reflect: 'm3Count',
          type: 'text',
        }
      ],
    };
    this.getList();
  };
  getList() {
    this.tableData.loading = true ;
    let data={
      "pageNumber":this.searchModel.pageNumber,
      "pageSize" : this.searchModel.pageSize,
      "currentPage" : this.searchModel.currentPage,
      "startDate":this.searchModel.startDate,
      "endDate":this.searchModel.endDate,
      "columns":this.searchModel.columns,
      "orderBy":this.searchModel.orderBy
    } ;
    let etime = DateObjToString((<Date>data.endDate));

    data.startDate = DateObjToString((<Date>data.startDate));
    data.endDate = etime && etime.indexOf(':') == -1 ? etime + " 23:59:59" : etime;
    if(this.chType===1){
      data["serialNumber"]=this.searchModel.serialNumber;
      data["channelBranchName"]=this.searchModel.channelBranchName;
      data["invitationCode"]=this.searchModel.invitationCode;
      console.log(data);
      this.service.getData(data)
        .pipe(
          filter( (res : Response) => {
            this.tableData.loading = false ;
            if(res.success === false){
              this.msg.fetchFail(res.message) ;
            };
            return res.success === true;
          })
        )
        .subscribe(
          ( res : Response ) => {
            this.tableData.data = (< Array<Object> >res.data);
            console.log(res);
            // if(res.page){
            //   this.totalSize = res.page["totalNumber"] ;
            // }
          }
        );
    }else if(this.chType===2){
      data["id"]=this.searchModel.id;
      data["name"]=this.searchModel.name;
      this.service.getDataH5(data)
        .pipe(
          filter( (res : Response) => {

            this.tableData.loading = false ;
            if(res.success === false){
              this.msg.fetchFail(res.message) ;
            };
            return res.success === true;
          })
        )
        .subscribe(
          ( res : Response ) => {
            this.tableData.data = (< Array<Object> >res.data);
            console.log(res);
            // if(res.page){
            //   this.totalSize = res.page["totalNumber"] ;
            // }
          }
        );
    }

  }
  exportChannel() {
    let data={
      "startDate":this.searchModel.startDate,
      "endDate":this.searchModel.endDate,
    }
    if(this.chType===1) {
      data["serialNumber"] = this.searchModel.serialNumber;
      data["channelBranchName"] = this.searchModel.channelBranchName;
      data["invitationCode"] = this.searchModel.invitationCode;
    }
    else if(this.chType===2){
      data["id"]=this.searchModel.id;
      data["name"]=this.searchModel.name;
    }
    this.service.exChannelBranch(data,this.chType);
      // .pipe(
      //   filter( (res : Response) => {
      //
      //     this.tableData.loading = false ;
      //     if(res.success === false){
      //       this.msg.fetchFail(res.message) ;
      //     };
      //     return res.success === true;
      //   })
      // )
      // .subscribe(
      //   ( res : Response ) => {
      //     this.tableData.data = (< Array<Object> >res.data);
      //     console.log(res);
      //     // if(res.page){
      //     //   this.totalSize = res.page["totalNumber"] ;
      //     // }
      //   }
      // );
  }
}
