import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {SearchModel} from './searchModel';
import {TableData} from '../../../share/table/table.model';
import {dataFormat, DateObjToString, unixTime} from '../../../format/index';
import {CommonMsgService, MsgService} from '../../../service/msg/index';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../../service/storage/index';
import {ObjToArray} from '../../../share/tool/index';
import {filter} from 'rxjs/operators';
import {Response} from '../../../share/model/index';
import {CaseManagementService} from '../../../service/collectionManagement/caseManagement.service';
import {CollectionBusiness} from '../../../service/collectionBusiness';
import { NzTreeNode,NzTreeNodeOptions } from 'ng-zorro-antd';

let __this;

@Component({
  selector: '',
  templateUrl: './caseManagement.component.html',
  styleUrls: ['./caseManagement.component.less']
})
export class CaseManagementComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: CaseManagementService,
    private CollectionBusiness:CollectionBusiness
  ) {
  } ;
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
  NzTreeNodes : NzTreeNode[];
  loading:Boolean = false;
  indeterminate :Boolean = false;
  isOkLoading:Boolean=false;
  validForm : FormGroup;
  disabledButton : Boolean = true;
  checkedNumber : number = 0;
  ngOnInit() {
    __this = this;
    this.getLanguage();
    this.validForm = this.fb.group({
      "name" : [null , [Validators.required] ] ,
    });
    this.getStage();
    this.getAllOverdueStaff();
    this.getUserLevel();
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
      isPage:false
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
          this.staff = (< Array<Object> >res.data);
          this.getPersonnel();
          this.getPersonnel1();
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
    let data ={
      orderStatus:this.chType,
      planRepaymentDateStart:model.planRepaymentDateStart,
      planRepaymentDateEnd:model.planRepaymentDateEnd,
      dueDays:model.dueDays,
      stageId:model.stageId,
      staffId:model.staffId,
      remindDateStart:model.remindDateStart,
      remindDateEnd:model.remindDateEnd,
      orderType:model.orderType,
      userGrade:model.userGrade,
      orderNo:model.orderNo,
      phonenum:model.phonenum,
      username:model.username,
      currentPage:model.currentPage,
      pageSize:model.pageSize,
      columns:['order_create_time'],
      orderBy:[false]
    };
    console.log(data);
    this.service.getData(data)
      .pipe(
        filter( (res : Response) => {
          this.loading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
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
          console.log(data);
          this.tableData = data;
          if(res.page){
            this.totalSize = res.page["totalNumber"] ;
          }
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
  toDetail(item){
    this.router.navigate(["/collectionCenter/collectDetail"], {
      queryParams: {
        from: "caseManagement",
        orderNo: item["orderNo"],
        orderStatus: item["orderStatus"],
        orderId: item["orderId"]
      }
    });
  }
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
          this.isVisible=false;
          this.getList();
        }
      );
  }
  handleCancel(){
    this.isVisible=false;
  }
  checkAll(value){
    if(this.tableData){
      this.tableData.forEach(data =>
        data['orderStatus']==3 || data['orderStatus']==6 ? data['checked'] = data['checked'] : data['checked'] = value
      );
      this.refreshStatus();
    }
  }
  getPersonnel(){
    let arr=[];
    if(this.staff) {
      let staffAll=this.staff.filter(item=>{
        return item['status'] == 2 ;
      });
      staffAll.map(item => {
        if (item['groupType'] === 1) {
          if (!arr.includes(item['firmName'])) {
            arr.push(item['firmName']);
          }
        }
      });
      let node = new Array<NzTreeNode>();
      let $this = this;
      for (let v of arr) {
        let children = new Array<NzTreeNodeOptions>();
        let a = staffAll.filter(item => {
          return item['firmName'] === v;
        });
        // let personnelType = $this.languagePack['list']['personnelType'];
        let arr1 = [];
        a.map(item => {
          if (item['groupType'] === 1) {
            if (!arr1.includes(item['groupName'])) {
              arr1.push(item['groupName']);
            }
          }
        });
        console.log(arr1);
        for (let f of arr1) {
          let b = a.filter(item => {
            return item['groupName'] === f && item['groupType']==1;
          });
          let grand = new Array<NzTreeNodeOptions>();
          for (let grandson of b) {
            grand.push({
              title: grandson['staffName'],
              key: grandson['id'],
              isLeaf: true
            })
          }
          children.push(
            {
              title: f,
              key: null,
              disabled: true,
              children: grand
            }
          )
        }
        node.push(new NzTreeNode({
          title: v,
          key: null,
          disabled: true,
          children: children
        }));
      }
      console.log(node);
      $this.NzTreeNodes = node;
      console.log($this.NzTreeNodes);
    }
  }
  getPersonnel1(){
    let arr=[];
    if(this.staff) {
      this.staff.map(item => {
        if (item['groupType'] === 1) {
          if (!arr.includes(item['firmName'])) {
            arr.push(item['firmName']);
          }
        }
      });
      let node = new Array<NzTreeNode>();
      let $this = this;
      for (let v of arr) {
        let children = new Array<NzTreeNodeOptions>();
        let a = this.staff.filter(item => {
          return item['firmName'] === v;
        });
        // let personnelType = $this.languagePack['list']['personnelType'];
        let arr1 = [];
        a.map(item => {
          if (item['groupType'] === 1) {
            if (!arr1.includes(item['groupName'])) {
              arr1.push(item['groupName']);
            }
          }
        });
        for (let f of arr1) {
          let b = a.filter(item => {
            return item['groupName'] === f && item['groupType']==1;
          });
          let grand = new Array<NzTreeNodeOptions>();
          for (let grandson of b) {
            grand.push({
              title: grandson['staffName'],
              key: grandson['id'],
              isLeaf: true
            })
          }
          children.push(
            {
              title: f,
              key: null,
              disabled: true,
              children: grand
            }
          )
        }
        node.push(new NzTreeNode({
          title: v,
          key: null,
          disabled: true,
          children: children
        }));
      }
      $this.NzTreeNode = node;
    }
  }
  allocation(){
    this.isVisible=true;
    this.id=[];
    this.tableData.map(item=>{
      if(item['checked']===true){
        this.id.push(item['id']) ;
      }
    });
    console.log(this.id);
  }
  retain(id,keepFlag){
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
      orderStatus:this.chType,
      planRepaymentDateStart:model.planRepaymentDateStart,
      planRepaymentDateEnd:model.planRepaymentDateEnd,
      dueDays:model.dueDays,
      stageId:model.stageId,
      staffId:model.staffId,
      remindDateStart:model.remindDateStart,
      remindDateEnd:model.remindDateEnd,
      orderType:model.orderType,
      userGrade:model.userGrade,
      orderNo:model.orderNo,
      phonenum:model.phonenum,
      username:model.username,
      currentPage:model.currentPage,
      pageSize:model.pageSize,
      columns:['order_create_time'],
      orderBy:[false]
    };
    console.log(data);
    this.service.exportOverdueOrder(data);
    this.loading = false ;
  }
  dateToString(data){
    if(data){
      return unixTime(new Date(data));
    }else {
      return;
    }
  }

}
