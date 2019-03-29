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
import {ChannelH5Service} from '../../service/channel/index';
let __this ;
@Component({
  selector : "" ,
  templateUrl : "./channelh5.component.html" ,
  styleUrls : ['./channelh5.component.less']
})
export class Channelh5Component implements OnInit{

  constructor(
    private translateSer : TranslateService ,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private router : Router ,
    private sgo : SessionStorageService,
    private fb : FormBuilder ,
    private service : ChannelH5Service ,

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
      "id":null,
      "name" : [null , [Validators.required] ] ,
      "link" : [null , [Validators.required] ] ,
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
            data:data["channel"]
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
          name : __this.languagePack['list']['link'] ,
          reflect : "link" ,
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
                name =  __this.languagePack['data']['channelStatus']['open'];
                break;
              }
              case 0: {
                name =  __this.languagePack['data']['channelStatus']['disable'];
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
            this.isVisible=true;
            this.validForm.patchValue({
              id: item.id,
              name:item.name,
              link:item.link,
              state:item.state
            });
          }
        }]
      }
    };
    this.getList() ;
  }
  totalSize : number = 0 ;
  search(){
    this.searchModel.currentPage = 1 ;
    this.getList() ;
  }
  reset() {
    this.searchModel = new SearchModel;
    this.getList();
  };
  getList(){
    this.tableData.loading = true ;
    let data=this.searchModel;

    this.searchCondition['state']=true;
    let sort = ObjToArray(this.searchCondition);
    data.columns = sort.keys;
    data.orderBy = sort.vals;

    this.service.getChannelH5(data)
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
          console.log(res.data);
          this.tableData.data = (< Array<Object> >res.data);
          console.log(this.tableData.data);
          this.totalSize = res.page.totalNumber ;
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
  handleCancel(){
    this.validForm.reset();
    this.isVisible = false;
  }
  handleOk(){
    this.isOkLoading = true;
    let valid = this.validForm.valid ;
    if(!valid){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return ;
    }
    let postData = this.validForm.value ;
    if(postData["id"]){
      this.update(postData);
    }else{
      this.addChannelH5(postData);
    }
  }
  addChannelH5(data){
    this.service.addChannelH5(data)
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
          this.isOkLoading = false;
          this.isVisible = false;
          this.getList();
          console.log(res.data);
        }
      );
  }
  update(data){
    this.service.update(data)
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
          this.isOkLoading = false;
          this.isVisible = false;
          this.getList();
          console.log(res.data);
        }
      );
  }
  add(){
    this.isVisible=true;
    this.validForm.reset();
    this.validForm.patchValue({
      state:1
    });
  }
}
