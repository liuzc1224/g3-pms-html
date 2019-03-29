import { Component , OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup , FormBuilder, Validators } from '@angular/forms' ;
import {TableData} from '../../share/table/table.model';
import { unixTime} from '../../format/index';
import {CommonMsgService, MsgService} from '../../service/msg/index';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../service/storage/index';
import {ObjToArray} from '../../share/tool/index';
import {filter} from 'rxjs/operators';
import {SearchModel} from "./searchModel";
import {Response} from '../../share/model/index';
import {ChannelService} from '../../service/channel/index';
let __this ;
@Component({
  selector : "" ,
  templateUrl : "./channelList.component.html" ,
  styleUrls : ['./channelList.component.less']
})
export class ChannelListComponent implements OnInit{

  constructor(
    private translateSer : TranslateService ,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private router : Router ,
    private sgo : SessionStorageService,
    private fb : FormBuilder ,
    private service : ChannelService ,

  ){} ;
  searchModel : SearchModel = new SearchModel() ;
  languagePack : Object ;
  tableData : TableData ;
  validForm : FormGroup;
  isVisible:Boolean=false;
  isOkLoading:Boolean=false;
  channelStatus:Array< String >;
  private searchCondition: Object = {};
  ngOnInit(){
    __this = this ;
    this.validForm = this.fb.group({
      "id":[null],
      "name" : [null , [Validators.required] ] ,
      "serialNumber" : [null , [Validators.required] ] ,
      "state" : [ 1 , [Validators.required] ] ,
    });
    this.getLanguage() ;
  };

  getLanguage(){
    this.translateSer.stream(["channel","common"])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            list:data['channel']['tabData'],
            channel:data['channel']
          };
          let channelStatus=data['channel']['channelStatus'];
          this.channelStatus=Object.values(channelStatus);


          this.initialTable() ;
        }
      )
  };
  initialTable(){
    this.tableData = {
      loading:false,
      showIndex : false ,
      tableTitle : [
        {
          name : __this.languagePack['list']['channelId'],
          reflect : "id" ,
          type : "text"
        },
        {
          name : __this.languagePack['list']['channelProvider'] ,
          reflect : "name" ,
          type : "text"
        },
        {
          name : __this.languagePack['list']['channelNumber'] ,
          reflect : "serialNumber" ,
          type : "text",
        },
        {
          name : __this.languagePack['list']['channelStatus'] ,
          reflect : "state" ,
          type : "text",
          filter : ( item ) => {
            let name;
            const status = item['state'] ;
            switch(status) {
              case 1: {
                name =  __this.languagePack['channel']['channelStatus']['open'];
                break;
              }
              case 0: {
                name =  __this.languagePack['channel']['channelStatus']['disable'];
                break;
              }
            }
            return (name ) ? name : "" ;
          }
        }
      ] ,
      btnGroup : {
        title : __this.languagePack['common']['operate']['name'] ,
        data : [{
          textColor : "#0000ff",
          name : __this.languagePack['common']['operate']['name'],
          bindFn : (item) => {
            this.setting(item);
          }
        },{
          textColor : "#0000ff",
          name : __this.languagePack['channel']['channelList']['selectChannelBranch'],
          bindFn : (item) => {
            this.router.navigate(['/channel/channelBranch'] , {
              queryParams : {
                name:item.serialNumber,
                id : item.id
              }
            });
          }
        }]
      }
    };
    this.getList() ;
  }
  totalSize : number = 0 ;
  getList(){
    this.tableData.loading = true ;
    let data=this.searchModel;
    this.searchCondition['state']=true;
    let sort = ObjToArray(this.searchCondition);
    data.columns = sort.keys;
    data.orderBy = sort.vals;
    this.service.getList(data)
      .pipe(
        filter( (res : Response) => {

          this.tableData.loading = false ;

          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.tableData.data = (< Array<Object> >res.data);
          if(res.page){
            this.totalSize = res.page["totalNumber"] ;
          }else{
            this.totalSize =0;
          }
        }
      );
  }
  pageChange($size : number , type : string) : void{
    if(type == 'size'){
      this.searchModel.pageSize = $size ;
    }

    if(type == 'page'){
      this.searchModel.currentPage = $size ;
    }
    this.getList() ;
  };
  handleCancel(){
    this.isVisible = false;
    this.validForm.reset();
  }
  handleOk() {
    this.isOkLoading = true;
    let valid = this.validForm.valid;
    if (!valid) {
      this.isOkLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return;
    }

    let postData = this.validForm.value;
    if(postData["id"]){
      this.update(postData);
    }else{
      this.addChannel(postData);
    }

  }
  update(data){
    this.isOkLoading=true;
    this.service.update(data)
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
          this.isVisible = false;
          this.getList();
        }
      );
  }
  addChannel(data){
    this.isOkLoading=true;
    this.service.addChannel(data)
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
          this.isVisible = false;
          this.getList();
        }
      );
  }
  search(){
    this.searchModel.currentPage = 1 ;
    this.getList() ;
  };
  reset(){
      this.searchModel = new SearchModel ;
      this.getList() ;
    };
  add(){
    this.isVisible=true;
    this.validForm.reset();
    this.validForm.patchValue({
      state:1
    })
  }
  setting(data){
    this.isVisible=true;
    this.validForm.patchValue({
      id: data.id,
      name:data.name ,
      serialNumber: data.serialNumber ,
      state:data.state
    })
  }
}
