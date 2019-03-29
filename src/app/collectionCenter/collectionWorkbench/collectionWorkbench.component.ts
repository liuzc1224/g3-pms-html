import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {SearchModel} from './searchModel';
import {CommonMsgService} from '../../service/msg/index';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../service/storage/index';
import {filter} from 'rxjs/operators';
import {Response} from '../../share/model/index';
import { collectionWorkbenchService } from "../../service/collectionWorkbench";
import {CaseManagementService} from '../../service/collectionManagement/caseManagement.service';
import {CollectionBusiness} from '../../service/collectionBusiness';
import { NzTreeNode,NzTreeNodeOptions } from 'ng-zorro-antd';
import { DateObjToString, dataFormat, collectOrderStatustransform } from "../../format";

let __this;

@Component({
  selector: '',
  templateUrl: './collectionWorkbench.component.html',
  styleUrls: ['./collectionWorkbench.component.less']
})
export class CollectionWorkbenchComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private Cmsg : CommonMsgService ,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: CaseManagementService,
    private benchService: collectionWorkbenchService,
    private CollectionBusiness:CollectionBusiness
  ) {
  } ;
  msgModel: Boolean= false;
  msgDot: Boolean= false;
  msgList: Array<Object>;
  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  tableData: Array<Object>;
  id: Array<Number>;
  chType:number=1;
  caseManagementType: Array<String>;
  logType: Array<String>;
  userLevel: Array<Object>;
  staff: Array<Object>;
  allStage: Array<Object>;
  stats: Array<Object>;
  keep: Array<Object>;
  isVisible:Boolean=false;
  allChecked:Boolean = false;
  NzTreeNode : NzTreeNode[];
  loading:Boolean = false;
  indeterminate :Boolean = false;
  isOkLoading:Boolean=false;
  validForm : FormGroup;
  disabledButton : Boolean = true;
  checkedNumber : number = 0;
  pushBackOrderTotalNum: Number = 0;
  todayPushBackOrderNum: Number = 0;
  allotOrderTotalNum: Number = 0;
  groupRanking: Number = 0;
  pushBackOrderTotalMoney: Number = 0;
  todayPushBackMoney: Number = 0;
  todayPushBackTotalMoney: Number = 0;
  stageRanking: Number = 0;
  staffID: Number = 0;
  staffName;
  exHidden : boolean =false;
  ws: any;
  ngOnInit() {
    __this = this;
    const userId = this.sgo.get("loginInfo")['id'] ;
    this.getLanguage();
    this.validForm = this.fb.group({
      "name" : [null , [Validators.required] ] ,
    });
    this.getStage();
    // this.getAllOverdueStaff();
    this.getUserLevel();
    this.ws = new WebSocket("ws://192.168.24.100:9049/webSocket");
    this.ws.onopen = (evt) => { 
      console.log("WebSocket开启成功");
      this.ws.send(userId);
    };
    this.ws.onmessage = (evt) => {
      console.log( "收到回复数据: " + evt.data);
      if( evt.data ) {
        this.msgDot = true
      }
    };
    this.ws.onclose = (evt) => {
      console.log("WebSocket已关闭");
    };
    this.ws.send(userId);
    // ws.close();
  };

  getStage(){
    let data={
      isPage:false
    };
    this.CollectionBusiness.getData(data)
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.allStage = (< Array<Object> >res.data).filter(item=>{
            return item['state'] == "ACTIVATE" ;
          });
        }
      );
  }
  getAllOverdueStaff(){
    let data={
      isPage : false
    };
    this.service.getAllOverdueStaff(data)
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.staff = (< Array<Object> >res.data).filter(item=>{
            return item['status'] == 2 ;
          });
        }
      );
  }
  removeRead(){
    let readList = []
    this.msgList.forEach( (item, index) => {
      item['read'] ? readList.push(item['id']) : ''
    } )
    this.changeList(readList, 0)
  }
  allRead(){
    let allList = []
    this.msgList.forEach( (item, index) => {
      allList.push(item['id'])
    } )
    this.changeList(allList, 1)
  }
  changeList(list:Array<any>, type: Number){
    let data = {
      ids: list,
      status: type,
      read: 1
    }
    if (list.length == 0) {
      this.Cmsg.fetchFail('暂无消息') ;
      return
    }
    this.service.updateRemind(data)
      .pipe(
        filter( (res : Response) => {

          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.getMsgList()
        }
      );
  }
  getUserLevel(){
    let data={
      isPage:false
    };
    this.service.loanUser(data)
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.userLevel = (< Array<Object> >res.data).filter(item=>{
            return item['status'] == 1 ;
          });
        }
      );
  };
  getLanguage() {
    this.translateSer.stream(['collectionManagement.caseManagement', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            list: data['collectionManagement.caseManagement']
          };
          this.keep=this.languagePack['list']['keep'];
          this.stats=this.languagePack['list']['stats'];
          this.caseManagementType=this.languagePack['list']['caseManagementType'];
          this.logType=this.languagePack['list']['logType'];
          this.initialTable();
        }
      );
  };
  changeStatus(data){
    this.chType=data;
    this.getList();
  }
  initialTable() {
    this.getList();
  }

  totalSize: number = 0;

  getList(){
    this.loading = true ;
    let model=this.searchModel;
    let planRepaymentDateEnd = DateObjToString(<Date>model.planRepaymentDateEnd);
    model.planRepaymentDateStart = DateObjToString(<Date>model.planRepaymentDateStart);
    model.planRepaymentDateEnd =
      planRepaymentDateEnd && planRepaymentDateEnd.indexOf(":") == -1
        ? planRepaymentDateEnd + " 23:59:59"
        : planRepaymentDateEnd;
    let remindDateEnd = DateObjToString(<Date>model.remindDateEnd);
    model.remindDateStart = DateObjToString(<Date>model.remindDateStart);
    model.remindDateEnd =
      remindDateEnd && remindDateEnd.indexOf(":") == -1
        ? remindDateEnd + " 23:59:59"
        : remindDateEnd;
    this.service.getStaffID()
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          if ( res["data"] ) {
            this.staffID = res["data"]['id'];
            this.staffName = res["data"]['staffName'];
            this.searchModel.stageId = res["data"]['stageId'];
            this.exHidden=true;
          }else {
            this.exHidden=false;
          }
          // this.getPersonnel();
          this.getAdminReport();

          let data ={
            orderStatus:this.chType,
            planRepaymentDateStart:model.planRepaymentDateStart,
            planRepaymentDateEnd:model.planRepaymentDateEnd,
            dueDays:model.dueDays,
            stageId:model.stageId,
            staffId:this.staffID,
            type: this.chType,
            remindDateStart:model.remindDateStart,
            remindDateEnd:model.remindDateEnd,
            orderType:model.orderType,
            userGrade:model.userGrade,
            orderNo:model.orderNo,
            phonenum:model.phonenum,
            username:model.username,
            currentPage:model.currentPage,
            pageSize:model.pageSize,
            columns:['due_days'],
            orderBy:[true]
          };
          this.benchService.getOverdueOrder(data)
            .pipe(
              filter( (res : Response) => {
                this.loading = false ;
                if(res.success === false){
                  this.Cmsg.fetchFail(res.message) ;
                }
                return res.success === true;
              })
            )
            .subscribe(
              ( res : Response ) => {
                let data=(< Array<Object> >res.data);
                if(data){
                  data=data.map(item=>{
                    return Object.assign(item,{checked:false}) ;
                  });
                }
                this.tableData = data;
                if(res.page){
                  this.totalSize = res.page["totalNumber"] ;
                }
              }
            );
        }
      );

  }
  pageChange($size : number , type : string) : void{
    if(type == 'size'){
      this.searchModel.pageSize = $size ;
    };

    if(type == 'page'){
      this.searchModel.currentPage = $size ;
    };
    this.getList() ;
  };
  reset(){
    this.searchModel = new SearchModel ;
    this.getList() ;
  };
  search(){
    this.getList() ;
  };
  refreshStatus(){
    const allChecked = this.tableData.every(value => value['checked'] === true);
    const allUnChecked = this.tableData.every(value => !value['checked']);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.tableData.some(value => value['checked']);
    this.checkedNumber = this.tableData.filter(value => value['checked']).length;
  }
  handleOk(){
    let postData = this.validForm.value;
    let data={
      idList:this.id,
      staffId:postData['name']
    };
    this.service.allocate(data)
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.msgModel=false;
          this.getList();
        }
      );
  }
  handleCancel(){
    this.msgModel=false;
  }
  checkAll(value){
    this.tableData.forEach(data =>
      data['orderStatus']==3 || data['orderStatus']==6 ? data['checked'] = data['checked'] : data['checked'] = value
    );
    this.refreshStatus();
  }
  // getPersonnel(){
  //   let arr=[];
  //   if(this.staff) {
  //     if(this.firmID){
  //       this.staff.map(item => {
  //         if (item['groupType'] === 1) {
  //           if(item['firmId']==this.firmID){
  //             if (!arr.includes(item['firmName'])) {
  //               arr.push(item['firmName']);
  //             }
  //           }
  //         }
  //       });
  //     }else{
  //       this.staff.map(item => {
  //         if (item['groupType'] === 1) {
  //           if (!arr.includes(item['firmName'])) {
  //             arr.push(item['firmName']);
  //           }
  //         }
  //       });
  //     }
  //     let node = new Array<NzTreeNode>();
  //     let $this = this;
  //     for (let v of arr) {
  //       let children = new Array<NzTreeNodeOptions>();
  //       let a = this.staff.filter(item => {
  //         return item['firmName'] === v;
  //       });
  //       let personnelType = $this.languagePack['list']['personnelType'];
  //       let arr1 = [];
  //       a.map(item => {
  //         if (item['groupType'] === 1) {
  //           if (!arr1.includes(item['groupName'])) {
  //             arr1.push(item['groupName']);
  //           }
  //         }
  //       });
  //       let grand = new Array<NzTreeNodeOptions>();
  //       for (let f of arr1) {
  //         let b = a.filter(item => {
  //           return item['groupName'] === f;
  //         });
  //         for (let grandson of b) {
  //           grand.push({
  //             title: grandson['staffName'],
  //             key: grandson['id'],
  //             isLeaf: true
  //           })
  //         }
  //         children.push(
  //           {
  //             title: f,
  //             key: null,
  //             disabled: true,
  //             children: grand
  //           }
  //         )
  //       }
  //       node.push(new NzTreeNode({
  //         title: v,
  //         key: null,
  //         disabled: true,
  //         children: children
  //       }));
  //     }
  //     $this.NzTreeNode = node;
  //   }
  // }
  allocation(){
    this.isVisible=true;
    this.id=[];
    this.tableData.map(item=>{
      if(item['checked']===true){
        this.id.push(item['id']) ;
      }
    });
  }
  retain(id, keepFlag){
    let data={
      "id":id,
      "keepFlag":keepFlag
    };
    this.service.setOverdueOrderKeep(data)
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.getList();
        }
      );
  }
  num(data){
    if(this.searchModel[data]){
      this.searchModel[data]=this.searchModel[data].replace(/[^0-9]/g,'');
    }
  }
  // getFirmID(){
  //   this.service.getFirmID()
  //     .pipe(
  //       filter( (res : Response) => {
  //         if(res.success === false){
  //           this.Cmsg.fetchFail(res.message) ;
  //         }
  //         return res.success === true;
  //       })
  //     )
  //     .subscribe(
  //       ( res : Response ) => {
  //         console.log(res.data);
  //         this.firmID=res["data"];
  //       }
  //     );
  // }
  export(){
    this.loading = true ;
    let model=this.searchModel;
    let planRepaymentDateEnd = DateObjToString(<Date>model.planRepaymentDateEnd);
    model.planRepaymentDateStart = DateObjToString(<Date>model.planRepaymentDateStart);
    model.planRepaymentDateEnd =
      planRepaymentDateEnd && planRepaymentDateEnd.indexOf(":") == -1
        ? planRepaymentDateEnd + " 23:59:59"
        : planRepaymentDateEnd;
    let remindDateEnd = DateObjToString(<Date>model.remindDateEnd);
    model.remindDateStart = DateObjToString(<Date>model.remindDateStart);
    model.remindDateEnd =
      remindDateEnd && remindDateEnd.indexOf(":") == -1
        ? remindDateEnd + " 23:59:59"
        : remindDateEnd;
    let data ={
      // firmId : this.firmID,
      orderStatus:this.chType,
      type: this.chType,
      planRepaymentDateStart:model.planRepaymentDateStart,
      planRepaymentDateEnd:model.planRepaymentDateEnd,
      dueDays:model.dueDays,
      stageId:model.stageId,
      staffId:this.staffID,
      remindDateStart:model.remindDateStart,
      remindDateEnd:model.remindDateEnd,
      orderType:model.orderType,
      userGrade:model.userGrade,
      orderNo:model.orderNo,
      phonenum:model.phonenum,
      username:model.username,
      currentPage:model.currentPage,
      pageSize:model.pageSize,
      columns:['due_days'],
      orderBy:[true]
    };
    this.benchService.exportOverdueOrder(data);
    this.loading = false ;
  }
  toDetail(item){
    this.router.navigate(["/collectionCenter/collectDetail"], {
      queryParams: {
        from: "collectionManagebench",
        orderNo: item["orderNo"],
        staffID: this.staffID,
        staffName: this.staffName,
        orderStatus: item["orderStatus"],
        orderId: item["orderId"]
      }
    });
  }
  msgModal(){
    this.msgModel = true;
    this.msgDot = false;
    this.getMsgList();
  }
  getMsgList(){
    let userId:Number = this.staffID; // this.sgo.get("loginInfo")['id']
    this.service.getRemindList(userId)
      .pipe(
        filter( (res : Response) => {

          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.msgList = <Array<Object>>res.data
        }
      );
  }
  getAdminReport() {
    const userId :Number = this.staffID ;
    this.benchService.getAdminReport(userId)
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          if(res.data && res.data['staffReportVO']){
            let data = res.data['staffReportVO'];
            this.pushBackOrderTotalNum = data['pushBackOrderTotalNum'];
            this.todayPushBackOrderNum = data['todayPushBackOrderNum'];
            this.allotOrderTotalNum = data['allotOrderTotalNum'];
            this.groupRanking = data['groupRanking'];
            this.pushBackOrderTotalMoney  = data['pushBackOrderTotalMoney'];
            this.todayPushBackMoney = data['todayPushBackMoney'];
            this.todayPushBackTotalMoney = data['todayPushBackTotalMoney'];
            this.stageRanking = data['stageRanking'];
          }
        }
      );
  }
  dateToString(data){
    if(data){
      return DateObjToString(new Date(data));
    }else {
      return;
    }
  }
}
