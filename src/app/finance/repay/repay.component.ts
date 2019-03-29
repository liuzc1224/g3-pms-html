import {Component, OnInit} from '@angular/core';
import {SearchModel} from './searchModel';
import {Adaptor, ObjToArray} from '../../share/tool';
import {TranslateService} from '@ngx-translate/core';
import {TableData} from '../../share/table/table.model';
import {RepayListService} from '../../service/fincial';
import {Response} from '../../share/model';
import {CommonMsgService} from '../../service/msg';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NumberValidator} from '../../share/validator';
import {Router} from '@angular/router';
import {dataFormat, DateObjToString, unixTime} from '../../format';
import {filter} from 'rxjs/operators';
import {OrderService} from '../../service/order';
import {forkJoin} from 'rxjs';
let __this;
@Component({
  selector: 'app-repay',
  templateUrl: './repay.component.html',
  styleUrls: ['./repay.component.less']
})
export class RepayComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private service: RepayListService,
    private msg: CommonMsgService,
    private fb: FormBuilder,
    private router: Router,
    private order: OrderService
  ) {
  };

  ngOnInit() {
    __this = this;
    this.getLanguage();

    this.validateForm = this.fb.group({
      'money': [null, [Validators.required, NumberValidator.isNumber]]
    });
    this.hasClearForm = this.fb.group({
      'currentRepay': [null, [Validators.required]],
      'description': [null],
      'isDone': [null, [Validators.required]],
      'orderId': [null, [Validators.required]],
      'repayMoney': [null, [Validators.required]],
      'repayType': [null, [Validators.required]],
      'repaymentDate': [null],
      'repaymentPlanId': [null, [Validators.required]],
      'userId': [null, [Validators.required]],
      'currentPeriod':[null],
      'totalPeriod':[null],
      'operator':1,
      'operationResult':0
    });

  };

  searchModel: SearchModel = new SearchModel();

  private searchCondition: Object = {};
  inputData:Array<Object>;
  validateForm: FormGroup;
  serchEnum: Array<Object>;
  languagePack: object;
  operType:Array<Object>;
  hasClearForm: FormGroup;

  getLanguage() {
    this.translate.stream(['common', 'financeModule.repayList','financeModule.serach1'])
      .subscribe(
        res => {
          this.languagePack = {
            common: res['common'],
            repayList: res['financeModule.repayList'],
            serach:res['financeModule.serach1']
          };

          this.getEnum(this.languagePack['repayList']['status1']);
          this.operType=this.languagePack['repayList']['operType'];
          this.reapyEnum = this.languagePack['repayList']['repayType'];
          this.serchEnum=this.languagePack['serach'];
          this.inputData=this.languagePack['repayList']['type'];
          this.initTable();
        }
      );
  };
  selectModel:String="creditOrderNo";
  inputContent:String="";
  statusEnum: Array<Object>;
  maxValue:Number=0;
  status: string;

  getEnum(data: Array<Object>) {
    this.statusEnum = data;
  };

  reapyEnum: Array<{ name: string, value: number }>;

  tableData: TableData;

  totalSize: number = 0;
  remark: Object;
  readonly :String="readonly";
  initTable() {
    this.tableData = {
      showIndex: true,
      loading: false,
      tableTitle: [
        {
          name: this.languagePack['repayList']['tabData']['letterReview'],
          reflect: 'creditOrderNo',
          type: 'text'
        },
        {
          name: this.languagePack['repayList']['tabData']['orderNo'],
          reflect: 'orderNo',
          type: 'text'
        },{
          name: this.languagePack['repayList']['tabData']['type'],
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
          name: this.languagePack['repayList']['tabData']['mobile'],
          reflect: 'userPhone',
          type: 'text',
        }, {
          name: this.languagePack['repayList']['tabData']['userName'],
          reflect: 'userName',
          type: 'text',
        }, {
          name: this.languagePack['repayList']['tabData']['periodsNumber'],
          reflect: 'totalPeriod',
          type: 'text',
          filter: (item) => {
            const currentPeriod = item['currentPeriod'];
            const totalPeriod=item['totalPeriod'];
            return (currentPeriod && totalPeriod) ? currentPeriod+" / "+totalPeriod : "";
          }
        }, {
          name: this.languagePack['repayList']['tabData']['periodRepayShould'],
          reflect: 'currentRepay',
          type: 'text',
          filter: (item) => {
            const currentRepay = item['currentRepay'];
            return (currentRepay ) ? (currentRepay).toFixed(2): "";
          }
        }, {
          name: this.languagePack['repayList']['tabData']['financingAmount'],
          reflect: 'financingMoney',
          type: 'text',
          filter: (item) => {
            const financingMoney = item['financingMoney'];
            return (financingMoney) ? (financingMoney).toFixed(2): "";
          }
        },{
          name: this.languagePack['repayList']['tabData']['interest'],
          reflect: 'lendRateMoney',
          type: 'text',
        },{
          name: this.languagePack['repayList']['tabData']['overdueFee'],
          reflect: 'overDueFine',
          type: 'text',
        },
        {
          name: this.languagePack['repayList']['tabData']['RepayTimeShould'],
          reflect: 'stringPlanRepaymentDate',
          type: 'text',
        },
        {
          name: this.languagePack['repayList']['tabData']['repayMount'],
          reflect: 'realRepayMoney',
          type: 'text',
        },{
          name: this.languagePack['repayList']['tabData']['repayDate'],
          reflect: 'recentRepaymentDate',
          type: 'text',
          filter: (item) => {
            const time = item['stringRecentRepaymentDate'];
            let name=null;
            if(item['stringRecentRepaymentDate']){
              name=item['stringRecentRepaymentDate'];
              return (name) ? name : null;
            }else{
              return null;
            }
          }
        }, {
          name: this.languagePack['repayList']['tabData']['orderStatus'],
          reflect: 'status',
          type: 'text',
          filter: (item) => {
            const status = item['status'];

            const map = __this.languagePack['repayList']['status2'];

            let desc = map.filter(item => {
              return item.value == status;
            });
            return (desc && desc[0].name) ? desc[0].name : "no";
          }
        }
      ],
      btnGroup: {
        title: this.languagePack['common']['operate']['name'],
        data: [
          {
            name: this.languagePack['repayList']['oper']['makeClear'],
            textColor: '#80accf',
            ico: 'anticon anticon-pay-circle-o',
            showContion: {
              name: 'status',
              value: [1,3,5]
            },
            bindFn: (item) => {
              this.selectItem = item;

              this.hasClearForm.reset();
              let userId = item.userId;
              this.maxValue=item['currentRepay'] - item['realRepayMoney'];
              let obj = {
                'orderId': item['orderId'],
                'repayMoney': (item['currentRepay'] - item['realRepayMoney']+item['overDueFine']).toFixed(2),
                'currentRepay': item['currentRepay'],
                'repaymentPlanId': item.id,
                'userId': userId,
                'isDone':true,
                'repayType': 1,//还款方式,
                'currentPeriod':item['currentPeriod'],
                'totalPeriod':item['totalPeriod'],
                'description':item['description'],
                'repaymentDate':item.repaymentDate,
                'operator':1,
                'operationResult':0
              };
                // 'description': [null],
                // 'repaymentDate': [null, [Validators.required]],
              this.hasClearForm.patchValue(obj);

              this.hasClearMark = true;
            }
          }, {
            textColor: '#6f859c',
            name: this.languagePack['common']['btnGroup']['a'],
            ico: 'anticon anticon-file',
            showContion: {
              name: 'status',
              value: [1, 2, 3, 4, 5,6]
            },
            bindFn: (item) => {
              const status = item['status'];

              const map = __this.languagePack['repayList']['status1'];
              console.log(map);
              let name = map.filter(item => {
                return item.value == status;
              });

              let loanStatus = (name && name[0].name) ? name[0].name : 'no';
              // console.log(loanStatus);
              this.router.navigate(['/order/detail'], {
                queryParams: {
                  order: item['orderId'],
                  userId: item['userId'],
                  loanStatus: loanStatus
                }
              });
              // this.noteMark = true ;

              // this.orderDetail(item.orderId);
              // this.getAllInfo(item.orderId);
              // this.selectOrder = item;
              // this.remark = item
            }
          }
        ]
      }
    };
    this.getList();
  }

  getList() {
    this.tableData.loading = true;
    let data = this.searchModel;
    if(data.minPlanRepaymentDate){
      data.minPlanRepaymentDate = DateObjToString((<Date>data.minPlanRepaymentDate));
    }
    if(data.maxPlanRepaymentDate){
      data.maxPlanRepaymentDate = DateObjToString((<Date>data.maxPlanRepaymentDate));
    }
    this.searchCondition['status']=false;
    console.log(data);
    this.service.getList(data)
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

  selectItem: object;

  hasClearMark: boolean = false;

  changeStatus(status: string) {
    // if (status === 'null') {
    //     this.reset();
    //     return false;
    // }
    // let statusArr = [];
    // statusArr.push(status);
    console.log(status)
    this.searchModel.currentPage = 1;
    this.searchModel.status = status;
    this.getList();
  };

  clearBill($event) {
    let postData = this.hasClearForm.value;
    if(postData.isDone == 'false') {
      if (!postData.repayMoney) {
        let msg = this.languagePack['common']['tips']['notEmpty'];

        this.msg.operateFail(msg);
        return;
      }
      this.makeRepay(postData);
    }else{
      this.makeRepay(postData);
    }


    // postData.repaymentDate = DateObjToString(postData.repaymentDate);
    //
    // let target = <HTMLButtonElement>$event.target;
    //
    // target.disabled = true;
    //
    // if (postData.isDone == 'false') {
    //   let currentRepay = this.selectItem['currentRepay'];
    //   let realRepay = postData.repayMoney / 1;
    //   if (realRepay > currentRepay) {
    //     let msg = this.languagePack['common']['tips']['overflow'];
    //     this.msg.operateFail(msg);
    //     target.disabled = false;
    //     return;
    //   }
    //   ;
    // }
    // ;
  };
  makeRepay(postData){
    postData.repaymentDate = DateObjToString(postData.repaymentDate);
    if(!postData.repaymentDate){
      postData.repaymentDate=DateObjToString( new Date());
    }
    console.log(postData);
    this.service.makeRepay(postData)
      .pipe(
        filter((res: Response) => {

          if (res.success === false) {
            this.msg.operateFail(res.message);
          }
          this.readonly="readonly";
          // target.disabled = false;

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
  }
  cancel(){
    this.hasClearMark = false;
    this.readonly="readonly";
  }
  change(){
    let result=this.hasClearForm.get('isDone').value;

    (result==false) ? this.readonly='' : this.readonly='readonly';
  }
  reset() {
    this.searchModel = new SearchModel();
    this.selectModel="orderNo";
    this.inputContent=null;
    this.getList();
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

  search() {
    this.searchModel.currentPage = 1;
    let name=this.selectModel;
    console.log(name);
    this.searchModel['creditOrderNo']=null;
    this.searchModel['orderNo']=null ;
    this.searchModel['userPhone'] =null ;
    this.searchModel['userName']=null ;
    this.searchModel[name.toString()]=this.inputContent;
    console.log(this.searchModel);
    this.getList();
  };

  // orderInfo : Object ;
  noteMark: boolean = false;

  orderDetail(orderId: number) {
    this.order.orderDetail(orderId)
      .pipe(
        filter((res: Response) => {
          if (res.success === false) {
            this.msg.fetchFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          this.orderInfo = res.data;

          this.noteMark = true;
        }
      );
  };

  orderInfo: Object;

  getAllInfo(id: number) {
    forkJoin(
      [
        this.order.orderDetail(id),
        this.order.getRepaymentRecord({orderIds: id})
      ]
    )
      .pipe(
        filter(
          (res) => {

            if (res[0]['success'] === false) {
              this.msg.operateFail(res[0]['message']);
            }
            ;

            if (res[1]['success'] === false) {
              this.msg.operateFail(res[1]['message']);
            }
            ;

            return res[0]['success'] === true && res[1]['success'] === true;
          }
        )
      )
      .subscribe(
        (res) => {

          // this.orderDetail = res.data ;

          let plan = res[1]['data'] ? res[1]['data'][0] : [];

          this.orderInfo = {
            'order': res[0]['data'],
            'plan': plan
          };

          this.noteMark = true;
        }
      );
  };
}
