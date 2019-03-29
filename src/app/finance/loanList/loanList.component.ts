import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SearchModel} from './searchModel';
import {Adaptor, ObjToArray} from '../../share/tool';
import {TableData} from '../../share/table/table.model';
import {dataFormat, DateObjToString} from '../../format';

import {LoanListService} from '../../service/fincial';
import {RepayListService} from '../../service/fincial';
import {OrderService} from '../../service/order';
import {CommonMsgService} from '../../service/msg/commonMsg.service';
import {Response} from '../../share/model/reponse.model';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {filter} from 'rxjs/operators';
import {SessionStorageService} from '../../service/storage';
import {Router} from '@angular/router';
import {forkJoin} from 'rxjs';
import {GetNow, DateToStamp} from '../../share/tool';

let __this;

@Component({
  selector: '',
  templateUrl: './loanList.component.html',
  styleUrls: ['./loanList.component.less']
})
export class LoanListComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private service: LoanListService,
    private msg: CommonMsgService,
    private fb: FormBuilder,
    private sgo: SessionStorageService,
    private router: Router,
    private order: OrderService,
    private Repayservice: RepayListService
  ) {
  };

  ngOnInit() {
    __this = this;

    this.getLanguage();

    this.validateForm = this.fb.group({
      'balanceApplyId':[null],
      'option': [null],
      'payDate': [null],
      'payMoney': [null],
      'paymentResult': [ null ],
    });
  };

  languagePack: Object;

  statusEnum: Array<Object>;
  tradingStatus: Array<Object>;
  serchEnum: Array<Object>;
  validateForm: FormGroup;
  hasClearForm: FormGroup;
  hidden:Boolean=false;
  inputData:Array<Object>;
  getLanguage() {
    this.translateSer.stream(['financeModule.list', 'common', 'financeModule.serach'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            data: data['financeModule.list'],
            serach: data['financeModule.serach']

          };
          this.inputData=data['financeModule.list']['type'];
          this.statusEnum = data['financeModule.list']['status1'];
          this.tradingStatus = data['financeModule.list']['paymentResult'];
          this.serchEnum = data['financeModule.serach'];
          console.log(this.tradingStatus);

          this.initialLoanTable();
        }
      );
  };

  searchModel: SearchModel = new SearchModel();
  private searchCondition: Object = {};

  changeStatus(status: string, type: string) {
    this.searchModel.status = status;
    this.searchModel.currentPage = 1;
    this.initialLoanTable();
  };

  tableData: TableData;

  initialLoanTable() {
    this.tableData = {
      tableTitle: [
        {
          name: __this.languagePack['data']['detail']['letterReview'],
          reflect: 'creditOrderNo',
          type: 'text'
        },
        {
          name: __this.languagePack['data']['detail']['orderNo'],
          reflect: 'orderNo',
          type: 'text'
        }, {
          name: __this.languagePack['data']['detail']['type'],
          reflect: 'loanType',
          type: 'text',
          filter:(item) =>{
            let loanType=item['loanType'];
            if(item['loanType']){
              let type=__this.inputData.filter(v => {
                return v.value===item['loanType']
              });
              loanType=(type && type[0].desc) ? type[0].desc : "";
            }
            return (loanType) ? loanType : "";
          }
        }, {
          name: __this.languagePack['data']['detail']['mobile'],
          reflect: 'phoneNumber',
          type: 'text'
        }, {
          name: __this.languagePack['data']['detail']['userName'],
          reflect: 'userName',
          type: 'text'
        }, {
          name: __this.languagePack['data']['detail']['cashTime'],
          reflect: 'stringApplyDate',
          type: 'text',
          // sort: true,
          // sortFn: (val, item) => {
          //   const column = item.reflect;
          //
          //   if (val == 'top') {
          //     this.searchCondition[column] = true;
          //   } else {
          //     this.searchCondition[column] = false;
          //   }
          //   ;
          //
          //   this.getList();
          // }
        }, {
          name: __this.languagePack['data']['detail']['applyCash'],
          reflect: 'applyCash',
          type: 'text'
        }, {
          name: __this.languagePack['data']['detail']['limit'],
          reflect: 'loanDays',
          type: 'text',
          filter:(item) =>{
            let loanDays=item['loanDays'];
            let time="";
            if(item['loanType']){
              let type=__this.inputData.filter(v => {
                return v.value===item['loanType']
              });
              time=(type && type[0].time) ? type[0].time : "";
            }
            return (loanDays) ? loanDays+time : "";
          }
        }, {
          name: __this.languagePack['data']['detail']['operateResult'],
          reflect: 'operation',
          type: 'text'
        }, {
          name: __this.languagePack['data']['detail']['operateTime'],
          reflect: 'operationTimeStr',
          type: 'text'
        }, {
          name: __this.languagePack['data']['detail']['operateName'],
          reflect: 'modifyUserName',
          type: 'text'
        }, {
          name: __this.languagePack['data']['detail']['orderStatus'],
          reflect: 'status',
          type: 'mark',
          markColor: { '1': "#ec971f", '2': "#87d068", '3': "#d9534f", '4': "#87d068" },
          filter: (item) => {
              const status = item['status'];

              const map = __this.languagePack['data']['loanStatus'];

              let name = map.filter(item => {
                  return item.value == status;
              });
              return (name && name[0].desc) ? name[0].desc : "no";
          }
        }
      ],
      loading: false,
      showIndex: true,
      btnGroup: {
        title: __this.languagePack['common']['operate']['name'],
        data: [
          {
            textColor: '#80accf',
            name: __this.languagePack['data']['makeLoan'],
            ico: 'anticon anticon-pay-circle-o',
            showContion: {
              name: 'status',
              value: [1]
            },
            bindFn: (item) => {
              this.selectItem = item;
              this.makeLoanMark = true;
              this.validateForm.reset();
              this.validateForm.patchValue({
                payMoney: item['applyCash'],
                balanceApplyId: item.id,
                paymentResult:true
              });
            }
          },
          {
            textColor: '#6f859c',
            name: __this.languagePack['common']['btnGroup']['a'],
            ico: 'anticon anticon-file',
            showContion: {
              name: 'status',
              value: [1, 2, 3, 4, 5, 6]
            },
            bindFn: (item) => {
              const status = item['status'];
              const map = __this.languagePack['common']['cashStatus'];
              let name = map.filter(item => {
                return item.value == status;
              });
              let loanStatus = (name && name[0].desc) ? name[0].desc : 'no';
              this.router.navigate(['/order/detail'], {
                queryParams: {
                  order: item['orderId'],
                  userId: item['userId'],
                  loanStatus: loanStatus
                }
              });
            }
          }
        ]
      }
    };
    this.getList();
  };

  hasClearMark: boolean = false;
  selectModel:String="creditOrderNo";
  inputContent:String="";

  selectItem: object;

  totalSize: number = 0;

  makeLoanMark: boolean = false;

  getList() {

    this.tableData.loading = true;
    let data = this.searchModel;
    let etime = DateObjToString((<Date>data.endTime));
    data.startTime = DateObjToString((<Date>data.startTime));
    data.endTime = etime && etime.indexOf(':') == -1 ? etime + " 23:59:59" : etime;
    this.searchCondition['status']=false;
    let sort = ObjToArray(this.searchCondition);
    data.columns = sort.keys;
    data.orderBy = sort.vals;
    // data.userPhone = data.phoneNumber;
    // this.service[data.type](data)
    this.service.loanList(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.msg.fetchFail(res.message);
          }
          this.tableData.loading = false;

          if (res.data && res.data['length'] === 0) {
            this.tableData.data = [];
            this.totalSize = 0;
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          let data_arr = res.data;
          console.log(res);
          this.tableData.data = (<Array<Object>>data_arr);
          if (res.page && res.page.totalNumber)
            this.totalSize = res.page.totalNumber;
          else
            this.totalSize = 0;

        }
      );
  };

  pageChange($size: number, type: string): void {
    if (type == 'size') {
      this.searchModel.pageSize = $size;
    }
    if (type == 'page') {
      this.searchModel.currentPage = $size;
    }
    this.getList();
  };

  reset() {
    this.searchModel = new SearchModel();
    this.selectModel="orderNo";
    this.inputContent=null;
    this.getList();
  };

  change() {
    let result=this.validateForm.get('paymentResult').value;

    (result==false) ? this.hidden=true :this.hidden=false;
  }

  makeNew($event) {
    let data = this.validateForm.value;
    if(this.hidden){
      data['payMoney']=null;
      if (!data.option) {
        let msg = this.languagePack['common']['tips']['notEmpty'];

        this.msg.operateFail(msg);
        return;
      }
      this.makeLoan(data);
    }else{
      const chooseTime = DateToStamp(data.payDate);
      const newTime = GetNow(true);
      if (chooseTime > newTime) {
        this.msg.operateFail(this.languagePack['common']['tips']['diffTime']);
        return false;
      }
      data.payDate=DateToStamp(data.payDate);
      if (!data.payDate || !data.payMoney) {
        let msg = this.languagePack['common']['tips']['notEmpty'];

        this.msg.operateFail(msg);
        return;
      }
      console.log(data);
      this.makeLoan(data);
      // let el = <HTMLButtonElement>$event.target;
      //
      // el.disabled = true;
      //
      // data.paymentResult = true;
    }
  };
  makeLoan(data){
    this.service.makeLoan(data)
      .pipe(
        filter((res: Response) => {

          if (res.success !== true) {
            this.msg.operateFail(res.message);
          }
          ;

          // el.disabled = false;

          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {

          this.msg.operateSuccess();

          this.getList();

          this.makeLoanMark = false;
        }
      );
  }
  search() {
    this.searchModel.currentPage = 1;
    this.searchModel['creditOrderNo']=null;
    this.searchModel['orderNo']=null ;
    this.searchModel['phoneNumber'] =null ;
    this.searchModel['userName']=null ;
    let name=this.selectModel;
    this.searchModel[name.toString()]=this.inputContent;
    console.log(this.searchModel);
    this.getList();
  };

  clearBill($event) {

    let postData = this.hasClearForm.value;

    postData.repaymentDate = DateObjToString(postData.repaymentDate);

    let target = <HTMLButtonElement>$event.target;

    target.disabled = true;

    if (postData.isDone == 'false') {
      let currentRepay = this.selectItem['currentRepay'];
      let realRepay = postData.repayMoney / 1;
      if (realRepay > currentRepay) {
        let msg = this.languagePack['common']['tips']['overflow'];
        this.msg.operateFail(msg);
        target.disabled = false;
        return;
      }
      ;
    }
    ;

    this.Repayservice.makeRepay(postData)
      .pipe(
        filter((res: Response) => {

          if (res.success === false) {
            this.msg.operateFail(res.message);
          }
          ;

          target.disabled = false;

          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          this.msg.operateSuccess();

          this.hasClearMark = false;

          this.getList();
        }
      );
  };
}
