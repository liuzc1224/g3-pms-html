import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {SearchModel} from './searchModel';
import {TableData} from '../../../share/table/table.model';
import {dataFormat, DateObjToString,unixTime} from '../../../format/index';
import {CommonMsgService, MsgService} from '../../../service/msg/index';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../../service/storage/index';
import {ObjToArray} from '../../../share/tool/index';
import {filter} from 'rxjs/operators';
import {Response} from '../../../share/model/index';
import {RecordService} from '../../../service/collectionManagement/record.service';

let __this;

@Component({
  selector: '',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.less']
})
export class RecordComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: RecordService,
  ) {
  } ;

  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  tableData: TableData;
  recordType:Array<string>;
  chType:number=1;
  ngOnInit() {
    __this = this;
    this.getLanguage();
  };
  changeStatus(data){
    this.chType=data;
    this.initialTable();
  }
  getLanguage() {
    this.translateSer.stream(['collectionManagement.record', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            data: data['collectionManagement.record'],
            callRecords:data['collectionManagement.record']['callRecords'],
            smsRecord:data['collectionManagement.record']['smsRecord']
          };
          this.recordType=this.languagePack["data"]["recordType"];
          this.initialTable();
        }
      );
  };
  initialTable(){
    if(this.chType===1){
      this.initcallRecords();
    }
    if(this.chType===2){
      this.initsmsRecord();
    }
  };
  initcallRecords() {
    this.tableData = {
      loading: false,
      showIndex: true,
      tableTitle: [
        {
          name: __this.languagePack['callRecords']['id'],
          reflect: 'id',
          type: 'text'
        },
        {
          name: __this.languagePack['callRecords']['callingSeat'],
          reflect: 'caller',
          type: 'text'
        },
        {
          name: __this.languagePack['callRecords']['callNumber'],
          reflect: 'callee',
          type: 'text',
        },
        {
          name: __this.languagePack['callRecords']['callStartTime'],
          reflect: 'startTime',
          type: 'text',
          filter : ( item ) =>{
            return unixTime(new Date(item.startTime)) ;
          }
        },
        {
          name: __this.languagePack['callRecords']['callEndTime'],
          reflect: 'endTime',
          type: 'text',
          filter : ( item ) =>{
            return unixTime(new Date(item.endTime)) ;
          }
        },
        {
          name: __this.languagePack['callRecords']['callDuration'],
          reflect: 'feeTime',
          type: 'text',
        },
        {
          name: __this.languagePack['callRecords']['recordingFiles'],
          reflect: 'recodingurl',
          type: 'audio'
        }
      ]
    };
    this.getList();
  }
  initsmsRecord() {
    this.tableData = {
      loading: false,
      showIndex: true,
      tableTitle: [
        {
          name: __this.languagePack['smsRecord']['id'],
          reflect: 'id',
          type: 'text'
        },
        {
          name: __this.languagePack['smsRecord']['sender'],
          reflect: 'operatorName',
          type: 'text'
        },
        {
          name: __this.languagePack['smsRecord']['send'],
          reflect: 'targetPhoneNumber',
          type: 'text'
        },
        {
          name: __this.languagePack['smsRecord']['content'],
          reflect: 'content',
          type: 'text'
        },
        {
          name: __this.languagePack['smsRecord']['sendTime'],
          reflect: 'sendTimeStr',
          type: 'text'
        },
        {
          name: __this.languagePack['smsRecord']['sendResult'],
          reflect: 'sendResult',
          type: 'text'
        }
      ]
    };
    this.getList();
  }
  totalSize: number = 0;
  getList(){
    if(this.chType===1){
      this.getcallRecords();
    }
    if(this.chType===2){
      this.getsmsRecord();
    }
  }
  getcallRecords(){
    this.tableData.loading = true ;
    let model=this.searchModel;
    let etime = DateObjToString((<Date>model.endTime));
    model.startTime = DateObjToString((<Date>model.startTime));
    model.endTime = etime && etime.indexOf(':') == -1 ? etime + " 23:59:59" : etime;
    let data ={
      callTo:model.callTo,
      callFrom:model.callFrom,
      callTimeStartBegin:model.startTime,
      callTimeStartEnd:model.endTime,
      currentPage:model.currentPage,
      pageSize:model.pageSize,
    };
    this.service.queryOverdueCallRecord(data)
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
  getsmsRecord(){
    this.tableData.loading = true ;
    let model=this.searchModel;
    let etime = DateObjToString((<Date>model.endTime));
    model.startTime = DateObjToString((<Date>model.startTime));
    model.endTime = etime && etime.indexOf(':') == -1 ? etime + " 23:59:59" : etime;
    let data ={
      receiver:model.receiver,
      sendTimeStart:model.startTime,
      sendTimeEnd:model.endTime,
      currentPage:model.currentPage,
      pageSize:model.pageSize,
    };
    this.service.queryOverdueMessageRecord(data)
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
    this.getList();
  };
}
