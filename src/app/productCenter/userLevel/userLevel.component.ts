import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {TableData} from '../../share/table/table.model';
import {CommonMsgService, MsgService} from '../../service/msg';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../service/storage';
import {SearchModel} from './searchModel';
import {filter} from 'rxjs/operators';
import {Response} from '../../share/model';
import {UserLevelService} from '../../service/productCenter';

let __this;

@Component({
  selector: '',
  templateUrl: './userLevel.component.html',
  styleUrls: ['./userLevel.component.less']
})
export class UserLevelComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: UserLevelService,
  ) {
  } ;

  languagePack: Object;
  tableData: TableData;
  searchModel : SearchModel = new SearchModel() ;
  inputData:Array< String >;
  StateData:Array< String >;
  crowd={};
  inputValue='id';
  totalSize : number = 0 ;
  isVisible:Boolean=false;
  isOkLoading:Boolean=false;
  isDeleteLoading:Boolean=false;
  validForm : FormGroup;
  isDelete:Boolean=false;
  objectKeys = Object.keys;
  ngOnInit() {
    __this = this;
    this.getLoanProduct();
    this.validForm = this.fb.group({
      "id":null,
      "userRank" : [null , [Validators.required] ] ,
      "loanProductNames" : [[] , [Validators.required] ] ,
      "userRule" : null ,
      "status" : [1,[Validators.required]] ,
    });
    this.getLanguage();
  };

  getLanguage() {
    this.translateSer.stream(['productCenter.userLevel', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            list: data['productCenter.userLevel']['list']
          };
          this.inputData=data['productCenter.userLevel']['input'];
          this.StateData=data['productCenter.userLevel']['state']
        }
      );
    this.initialTable();
  };

  initialTable() {
    this.tableData = {
      loading: false,
      showIndex: false,
      tableTitle: [
        {
          name: __this.languagePack['list']['id'],
          reflect: "id",
          type: "text"
        },
        {
          name: __this.languagePack['list']['name'],
          reflect: "userRank",
          type: "text"
        },
        {
          name: __this.languagePack['list']['creationTime'],
          reflect: "createTimeStr",
          type: "text",
        },
        {
          name: __this.languagePack['list']['updateTime'],
          reflect: "modifyTimeStr",
          type: "text",
        },
        {
          name: __this.languagePack['list']['rule'],
          reflect: "userRule",
          type: "text",
        },
        {
          name: __this.languagePack['list']['product'],
          reflect: "loanProductNames",
          type: "text",
          filter: (item) => {
            let arr=item['loanProductNames'].split("_");
            let name="";
            for(let a of arr){
              if(__this.crowd[a]){
                name+="   "+__this.crowd[a]+"  "
              }
            }
            // return arr;
            // let type=__this.StateData.filter(v => {
            //   return v.value===item['status']
            // });
            return (name) ? name : "";
          }
        },
        {
          name: __this.languagePack['list']['state'],
          reflect: "status",
          type: "text",
          filter: (item) => {
            let type=__this.StateData.filter(v => {
              return v.value===item['status']
            });
            return (type && type[0].desc) ? type[0].desc : "";
          }
        }
      ],
      btnGroup: {
        title: __this.languagePack['common']['operate']['name'],
        data: [{
          textColor: "#0000ff",
          name: __this.languagePack['common']['operate']['edit'],
          bindFn: (item) => {
            let data=__this.crowd
            let value=item.loanProductNames.split("_");
            console.log(data);
            value=value.filter(v => {
              return data[v];
            });
            console.log(value);
            __this.validForm.patchValue({
              id:item.id,
              userRank : item.userRank ,
              loanProductNames : value ,
              userRule : item.userRule ,
              status : item.status ,
            });
            __this.isVisible=true;
          }
        },{
          textColor: "#0000ff",
          name: __this.languagePack['common']['operate']['delete'],
          bindFn: (item) => {
            this.isDelete=true;
            this.sgo.set('UserLevelId', {
              id: item.id,
            });
          }
        }]
      }
    };
    this.getList();
  }
  getLoanProduct(){
    this.service.getLoanProduct()
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
          __this.crowd=(< Array<Object> >res.data);
          console.log(__this.crowd)
        }
      );
  }
  getList(){
    this.tableData.loading = true ;
    let model=this.searchModel;
    model.columns=['status'];
    model.orderBy=[false];
    this.service.getUserLevel(model)
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
          console.log(res.data);
          if(res.page){
            this.totalSize = res.page["totalNumber"] ;
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
  add(){
    this.validForm.reset();
    this.validForm.patchValue({
      loanProductNames : [] ,
      status : 1 ,
    });
    this.isVisible=true;
  }
  search(){
    this.getList();
  }
  keyupId(){
    let val=this.searchModel.id;
    this.searchModel.id=val.replace(/[^0-9]/g,'');
    console.log(this.searchModel.id);
  }
  handleOk(){
    this.isOkLoading = true;
    let valid = this.validForm.valid;
    let postData = this.validForm.value;
    console.log(postData.loanProductNames.join("_"));
    if (!valid ){
      this.isOkLoading = false;
      this.msg.error(this.languagePack['common']['tips']['notEmpty']);
      return;
    }
    postData.loanProductNames=postData.loanProductNames.join("_");
    console.log(postData)
    if(postData["id"]){
      this.updateUserLevel(postData);
    }else{
      this.addUserLevel(postData);
    }
  }
  updateUserLevel(data){
    this.isOkLoading=true;
    this.service.updateUserLevel(data)
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
          console.log(res.data);
          this.isVisible = false;
          this.getList();
        }
      );
  }
  addUserLevel(data){
    this.isOkLoading=true;
    this.service.addUserLevel(data)
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
          console.log(res.data);
          this.isVisible = false;
          this.getList();
        }
      );
  }
  handleCancel(){
    this.isVisible=false;
  }
  deleteCancel(){
    this.isDelete=false;
  }
  deleteOk(){
    this.isDeleteLoading=true;
    let data = {
      id:this.sgo.get("UserLevelId").id
    };
    this.service.deleteUserLevel(data)
      .pipe(
        filter( (res : Response) => {
          this.isDeleteLoading = false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          // this.totalSize = res.page.totalNumber ;
          __this.isDelete=false;
          this.getList();
        }
      );
  }
}
