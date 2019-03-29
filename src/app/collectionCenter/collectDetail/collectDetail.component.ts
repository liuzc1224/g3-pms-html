import {Component, OnInit} from '@angular/core';
import { environment } from "../../../environments/environment";
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {SearchModel} from './searchModel';
import {TableData} from '../../share/table/table.model';
import {CommonMsgService, MsgService} from '../../service/msg/index';
import {Router, ActivatedRoute} from '@angular/router';
import {SessionStorageService} from '../../service/storage/index';
import {filter} from 'rxjs/operators';
import md5 from 'js-md5';
import './js-sti-1.0.0.js'
import {Response} from '../../share/model/index';
import { collectionWorkbenchService } from "../../service/collectionWorkbench";
import { dataFormat, reviewOrderStatustransform } from "../../format";
declare var STI: any;
const host = environment.host;

@Component({
  selector: '',
  templateUrl: './collectDetail.component.html',
  styleUrls: ['./collectDetail.component.less']
})
export class CollectDetailComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private msg: MsgService,
    private Cmsg: CommonMsgService,
    private router: Router,
    private routerInfo: ActivatedRoute,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: collectionWorkbenchService,
  ) {
  } ;

  searchModel: SearchModel = new SearchModel();

  languagePack: Object;
  logForm: FormGroup;
  extendForm: FormGroup;
  phoneForm: FormGroup;

  tableData: TableData;
  offer: Array<String>;
  receive: Array<String>;


  chType:number=1;
  phoneType:Number = 1;
  phoneMdlType:number=1;

  addModel: Boolean = false;
  extendModel: Boolean = false;
  isOkLoading:Boolean=false;
  phoneModel:Boolean=false;

  phoneArray: Array<Object> = [{phone: ''}]; // 输入框电话
  choosePhoneArray: Array<String> = []; // 已选择电话
  loanDetail: any ;
  extendInfo: any = {}; // 展期详情
  orderDetail: any = {} ; // 借款订单详情
  account: any = {} ; // 取款账户
  paymentDetail: Array<any> ; // 放款详情
  repaymentDetail: Array<any> ; // 还款详情
  creditDetail: any = {} ; // 信审订单信息
  userInfo: any = {} ; // 个人信息
  userAuth: any = {} ; // 用户实名信息
  // orderDetail: any = {} ; // 工作信息
  creditOrderHistory: Array<any> ; // 历史信审订单
  orderHistory: Array<any> ; // 历史借款订单
  // orderDetail: any = {} ; // 征信查询信息
  // orderDetail: any = {} ; // 征信贷款订单汇总
  // orderDetail: any = {} ; // 征信访问记录
  spcScore: Array<any> ; // 征信评分
  contact: Array<any> ; // 紧急联系人
  msgLogList: Array<any> ; // 短信记录
  callLogList: Array<any> ; // 通话记录
  friendInfo:Array<any>; // 紧急联系人
  phoneList:Array<any>; // 通讯录
  para : any;
  msgRed: Number = 0;

  // 左侧导航菜单
  navLeft = [{ content: '借款订单详情', id: 'qqq' }, { content: '信审订单详情', id: 'sss' }, { content: '紧急联系人', id: 'aaa' },
              { content: '短信记录', id: 'eee' }, { content: '通话记录', id: 'rrr' }, { content: '联系人通讯录', id: 'ggg' }];
  education = ['DIPLOMA_I', 'DIPLOMA_II', 'DIPLOMA_III', 'SLTA', 'S1', 'SLTP', 'S2', 'SD', 'S3'];
  marital = ['LAJANG', 'MENIKAH', 'CERAI', 'LAINNYA'];
  ngOnInit() {

    document.getElementsByClassName("routerWrap")[0].scrollTop = 0;
    this.logForm = this.fb.group({
      logType: [null, [Validators.required] ],
      remark: [ null, [ Validators.required ] ],
      remind: [ null, [ ] ],
      remindTime: [ null, [ ] ],
      remindContent: [ null, [ ] ],
    });
    this.routerInfo.queryParams.subscribe(para => {
      this.para = para;
    });
    this.extendForm = this.fb.group({ money: [ null, [ Validators.required ] ], });
    this.phoneForm = this.fb.group({ phoneNumber: [ null, [ ] ], msg: [ null, [ ] ], });
    this.getLanguage();
  };

  getLanguage() {
    this.translateSer.stream(['common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common']
          };
          this.getRecallDetail();
          this.getCollectionList();
        }
      );
  };
 
  getRecallDetail() {
    let orderId = this.para.orderId
    this.service.getDetailList(orderId) // 1496
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
          this.loanDetail = res.data;
          this.orderDetail = res.data['urgentRecallOrderDetailVO']
          this.account = res.data['urgentRecallAccountVOS'][0]
          this.paymentDetail = res.data['paymentDetailVOList']
          this.repaymentDetail = res.data['repaymentDetailVOList']
          this.creditDetail = res.data['urgentRecallCreditDetailVO']
          this.userAuth = res.data['urgentRecallUserAuthVO']
          this.userInfo = res.data['urgentRecallUserInfoVO'] // 工作信息
          this.userInfo.educationBackground = this.education[this.userInfo.educationBackground+1]
          this.userInfo.maritalStatus = this.marital[this.userInfo.maritalStatus]
          this.creditOrderHistory = res.data['creditOrderHistoryVOList']
          this.orderHistory = res.data['orderHistoryVOList']
          // this.userInfo = res.data['urgentRecallUserInfoVO'] // 征信查询信息
          // this.userInfo = res.data['urgentRecallUserInfoVO'] // 征信贷款订单汇总
          // this.userInfo = res.data['urgentRecallUserInfoVO'] // 征信访问记录
          this.spcScore = res.data['urgentRecallSPCVO']['spcScoreVOList']
          this.contact = []; this.phoneList = [];
          res.data['urgentRecallContactVOList'].forEach((item, index) => {
            if ( item['contactGrade'] == 0 ) {
              this.contact.push(item)
            } else {
              this.phoneList.push(item)
            }
          });
          this.msgLogList = res.data['urgentRecallMsgLogVOList'] // 短信记录
          this.callLogList = res.data['urgentRecallCallLogVOList'] // 通话记录
        }
      );
  }
  // 添加颜色
  changeColor(type: Number){
    let s = "";
    let v = "";
    if ( type != this.msgRed ) {
      this.msgRed = type
      if ( type == 1 ) {
        s = "借款"; v = "还钱";
      } else {
        s = "还钱"; v = "借款"
      }
      this.msgLogList.forEach((item, index) => {
        let reg1 = new RegExp("(" + s + ")", "g")
        let reg2 = new RegExp("(<font color=red>" + v + "</font>)", "g")
        let newstr1 = item['contactName'].replace(reg1, "<font color=red>$1</font>")
        let newstr2 = newstr1.replace(reg2, v)
        item['contactName'] = newstr2
      } )
    }
  }
  // 左侧导航跳转
  goAnchor(location:string) {
    window.location.hash = location;
  }
  // 底部表格切换
  changeStatus(data){
    this.chType=data;
    this.searchModel.currentPage = 1;
    switch ( data ) {
      case 1:
        this.getCollectionList();
        break
      case 2:
        this.getCallList();
        break
      case 3:
        this.getMsgList();
        break
      case 4:
        this.getRotateList();
        break
      default:
        break
    }
  }
  // 换页
  pageChange(){

  }
  // 返回审核列表
  refresh(){
    this.router.navigate(["/collectionCenter/"+this.para.from], {
      queryParams: {
        from: "collectionManagebench"
      }
    });
  }
  // 复制剪切板
  copyClipboard ( type: Number ) {
    const input = document.createElement('input');
    document.body.appendChild(input);
    if ( type == 1 ) {
      input.setAttribute('value', this.userInfo['phoneNumber']);
    } else {
      input.setAttribute('value', '22222222222');
    }
    input.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      this.msg.success('复制成功');
    } else {
      this.msg.error('复制失败');
    }
    document.body.removeChild(input);
  }


  totalSize: number = 0;
  // 获取催收日志
  getCollectionList(){
    this.tableData = {
      tableTitle: [
        {
          name: '编号',
          reflect: "id",
          type: "text"
        },
        {
          name: '创建时间',
          reflect: "createTime",
          filter: (item) => {
            return dataFormat(item.createTime)
          },
          type: "text"
        },
        {
          name: '日志类型',
          reflect: "logType",
          filter: item =>{
            let type = ''
            switch ( item['logType'] ) {
              case 1:
                type = '拨号无应答'
                break
              case 2:
                type = '延后还款'
                break
              case 3:
                type = '拒绝还款'
                break
              case 4:
                type = '空号'
                break
              case 5:
                type = '停机'
                break
              case 6:
                type = '展期'
                break
              default:
                break
            }
            return type
          },
          type: "text",
        },
        {
          name: '催收日志',
          reflect: "remark",
          type: "text"
        },
        {
          name: '预约下次提醒时间',
          reflect: "remindTime",
          filter: (item) => {
            return dataFormat(item.remindTime)
          },
          type: "text"
        },
        {
          name: '提醒内容',
          reflect: "remindContent",
          type: "text"
        },
        {
          name: '催收员',
          reflect: "operationName",
          type: "text"
        }
      ],
      loading: false,
      showIndex: true
    };
    this.tableData.loading = true ;
    let model=this.searchModel;
    let data ={
      currentPage:model.currentPage,
      pageSize:model.pageSize,
    };
    this.service.getRecallLogList(data, this.para.orderId)
      .pipe(
        filter( (res : Response) => {

          this.tableData.loading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.tableData.data = (< Array<Object> >res.data);
          if(res.page){
            this.totalSize = res.page["totalNumber"] ;
          }
        }
      );
  }
  // 催收通话记录
  getCallList(){
    this.tableData = {
      tableTitle: [
        {
          name: '通话呼叫ID',
          reflect: "id",
          type: "text"
        },
        {
          name: '主叫席座号',
          reflect: "creditOrderNo",
          type: "text"
        },
        {
          name: '呼叫号码',
          reflect: "userPhone",
          type: "text"
        },
        {
          name: '呼叫开始时间',
          reflect: "createTime",
          filter: (item) => {
            return dataFormat(item.createTime)
          },
          type: "text"
        },
        {
          name: '呼叫结束时间',
          reflect: "endTime",
          type: "text"
        },
        {
          name: '通话时长（分）',
          reflect: "feeTime",
          type: "text"
        },
        {
          name: '录音文件',
          reflect: "recodingurl",
          type: "audio"
        }
      ],
      loading: false,
      showIndex: true
    };
    this.tableData.loading = true ;
    let model=this.searchModel;
    let data ={
      currentPage:model.currentPage,
      pageSize:model.pageSize,
    };
    this.service.getWebCallList(data, this.para.orderId)
      .pipe(
        filter( (res : Response) => {

          this.tableData.loading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.tableData.data = (< Array<Object> >res.data);
          if(res.page){
            this.totalSize = res.page["totalNumber"] ;
          }
        }
      );
  }
  // 催收短信记录
  getMsgList(){
    this.tableData = {
      tableTitle: [
        {
          name: 'ID',
          reflect: "id",
          type: "text"
        },
        {
          name: '发送人',
          reflect: "operatorName",
          type: "text"
        },
        {
          name: '发送对象',
          reflect: "targetPhoneNumber",
          type: "text"
        },
        {
          name: '短信内容',
          reflect: "content",
          type: "text"
        },
        {
          name: '短信发送时间',
          reflect: "createTime",
          filter: (item) => {
            return dataFormat(item.createTime)
          },
          type: "text"
        },
        {
          name: '发送结果',
          reflect: "sendResult",
          type: "text"
        }
      ],
      loading: false,
      showIndex: true
    };
    this.tableData.loading = true ;
    let model=this.searchModel;
    let data ={
      currentPage:model.currentPage,
      pageSize:model.pageSize,
    };
    this.service.getMsgLogList(data, this.para.orderId)
      .pipe(
        filter( (res : Response) => {

          this.tableData.loading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.tableData.data = (< Array<Object> >res.data);
          if(res.page){
            this.totalSize = res.page["totalNumber"] ;
          }
        }
      );
  }
  // 案件流转记录
  getRotateList(){
    this.tableData = {
      tableTitle: [
        {
          name: '创建时间',
          reflect: "createTime",
          filter: (item) => {
            return dataFormat(item.createTime)
          },
          type: "text"
        },
        {
          name: '阶段',
          reflect: "stageId",
          type: "text"
        },
        {
          name: '逾期天数',
          reflect: "overdueDay",
          type: "text"
        },
        {
          name: '分配至催收员',
          reflect: "staffName",
          type: "text"
        },
        {
          name: '操作人',
          reflect: "operatorName",
          type: "text"
        }
      ],
      loading: false,
      showIndex: true
    };
    this.tableData.loading = true ;
    let model=this.searchModel;
    let data ={
      currentPage:model.currentPage,
      pageSize:model.pageSize,
    };
    this.service.getFlowHistoryt(data, this.para.orderId)
      .pipe(
        filter( (res : Response) => {

          this.tableData.loading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.tableData.data = (< Array<Object> >res.data);
          if(res.page){
            this.totalSize = res.page["totalNumber"] ;
          }
        }
      );
  }

  // 催收日志模态框 4 Functions
  addModelFn () {
    this.addModel = true;
  }
  handleOk () {
    this.isOkLoading = true;
    let valid = this.logForm.valid;
    let postData = this.logForm.value;
    if (!valid) {
      this.isOkLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return;
    }
    if (postData.agree) {
      if( !postData.datePickerTime || !postData.content ) {
        this.isOkLoading = false;
        this.msg.error(this.languagePack['common']['tips']['notEmpty']);
        return;
      };
    }

    this.addChannel(postData);
  }
  handleCancel(){
    this.addModel = false;
    this.logForm.reset();
  }
  addChannel (data) {
    this.isOkLoading=true;
    let postData = {
      logType: data.logType,
      remark: data.remark,
      remind: data.remind? 1 : 0,
      remindTime: data.remindTime,
      remindContent: data.remindContent,
      orderId: this.para.orderId
    }
    this.service.postRecallLog(postData)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.addModel = false;
          this.logForm.reset();
          this.getCollectionList();
        }
      );
  }

  // 展期模态框 4 Functions
  addextendFn () {
    this.extendModel = true;
    this.service.getExhibition(this.para.orderId)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          if(res.data){
            this.extendInfo = res.data;
          }
        }
      );
  }
  extendOk () {
    this.isOkLoading = true;
    let valid = this.extendForm.valid;
    let postData = this.extendForm.value;
    if (!valid) {
      this.isOkLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return;
    }

    this.addextend(postData);
  }
  extendCancel(){
    this.extendModel = false;
    this.extendForm.reset();
  }
  addextend (postData) {
    this.isOkLoading=true;
    let data = {
      exhibitionPeriodMoney: postData.money,
      orderId: this.extendInfo['orderId'],
    }
    this.service.exhibition(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.extendModel = false;
          this.extendForm.reset();
          this.getCollectionList();
        }
      );
  }

  // 电话短信模态框 4 Functions
  phoneFn (type: Number) {
    this.phoneType = type;
    this.phoneModel = true;
    this.phoneList = [];
    this.friendInfo = [];
    this.phoneMdlType = 2
    this.service.getFriendInfo(this.para.orderId)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          let data = <Array<Object>>res.data
          data.forEach( ( item, index ) => {
            item['checked'] = false;
            if ( item['contactGrade'] == 0 ) {
              this.phoneList.push(item)
            } else {
              this.friendInfo.push(item)
            }
            this.phoneMdlType = 1
          });
        }
      );
  }
  phoneOk () {
    this.isOkLoading = true;
    if (this.phoneType == 1) {
      // 打电话
      let phoneNumber = []
      this.phoneArray[0]['phone'] == '' ? '' : phoneNumber.push(this.phoneArray[0]['phone'])
      phoneNumber = phoneNumber.concat(this.choosePhoneArray)

      if( phoneNumber.length == 0 ) {
        this.isOkLoading = false;
        this.msg.error(this.languagePack['common']['tips']['notEmpty']);
        return;
      };
      if ( phoneNumber.length != 1 ) {
        this.isOkLoading = false;
        this.msg.error('只能选择一个号码');
        return;
      }
      this.callModal(phoneNumber[0])
      this.phoneModel = false;
    } else {
      // 发短信
      let phoneNumber = []
      let msg = this.phoneForm.value.msg
      this.phoneArray.forEach((item, index) => {
        item['phone'] == '' ? '' : phoneNumber.push(this.phoneArray[0]['phone'])
      });
      phoneNumber = phoneNumber.concat(this.choosePhoneArray)
      if( phoneNumber.length == 0 || msg == '' || msg == null ) {
        this.isOkLoading = false;
        this.msg.error(this.languagePack['common']['tips']['notEmpty']);
        return;
      };
      this.addphone(phoneNumber,msg)

    }
    this.phoneModel = false;
    this.choosePhoneArray = [];
  }
  phoneCancel(){
    this.phoneModel = false;
    this.phoneForm.reset();
  }
  addphone (phoneNumber, msg) {
    this.isOkLoading=true;
    let data = {
      msgContent: msg,
      orderId: this.para.orderId,
      operatorId: this.para.staffID,
      operatorName: this.para.staffName,
      phoneNumbers: phoneNumber
    }
    this.service.sendMsg(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.Cmsg.operateSuccess() ;
          this.phoneModel = false;
          this.phoneForm.reset();
          this.getCollectionList();
        }
      );
  }
  // 电话模态框切换
  changePhoneStatus (data: number) {
    this.phoneMdlType=data;
  }
  // 电话添加删除
  addphoneNum () {
    this.phoneArray.push({phone: ''})
  }
  deletephoneNum (item) {
    let index = this.phoneArray.indexOf(item)
    this.phoneArray.splice(index, 1)
  }
  // 多选联系人
  checkAll (event: Event, type: number) {
    let list = []
    if ( type == 1 ) {
      list = this.friendInfo
    } else if ( type == 2 ) {
      list = this.phoneList
    } else if ( type == 3 ) {
      // list = this.loanDetail
    }
    if ( event ) {
      list.forEach( ( item, index ) => {
        if ( !item['checked'] ) {
          item['checked'] = true
          this.checkEmergent(item)
        }
      })
    } else {
      list.forEach( ( item, index ) => {
        if ( item['checked'] ) {
          item['checked'] = false
          this.checkEmergent(item)
        }
      })
    }
  }
  // 单选联系人
  checkEmergent ( item ) {
    if ( item.checked ) {
      this.choosePhoneArray.push(item.contactPhone)
    } else {
      let index = this.choosePhoneArray.indexOf(item.contactPhone)
      this.choosePhoneArray.splice(index, 1)
    }
  }
  // 拨打电话
  callModal (phone) {
    var account = 'MyKlik';
    var password = md5('MyKlik2018');// 后台密码MD5
    var channelKey = '18528e3f0af8488e94bd2a4bbd65c97c';// 后台channelKey
    var voipAccount = '805717001';
    var voipPassword = '81265489';// VOIP密码
    var msisdn = phone;// 手机号，请使用0开头格式
    var extendId = '17609885098';// 自定义的唯一扩展ID-需要绑定此通会话的id，此字段由客户提供，用于将通话记录关联进客户的通话记录中
    //需要回调响应的Url，需要进行URL编码，格式为：http://xxxxx/xxx?extendId={extendId}&startTime={startTime}&endTime={endTime}&feeTime={feeTime}&endDirection={endDirection}&endReason={endReason}&recodingUrl={recodingUrl}
    var postUrl = encodeURI('http://g3app-pre.pandafintech.com.br/urgentRecall/webcall/callback?extendId={extendId}&startTime={startTime}&endTime={endTime}&feeTime={feeTime}&endDirection={endDirection}&endReason={endReason}&recodingUrl={recodingUrl}' );
    STI.call('btn-msisdn', 'div-iframe', account, password, channelKey, voipAccount, voipPassword, msisdn, extendId, postUrl);
  }
}
