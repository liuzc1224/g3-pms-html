import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { ShareModule } from '../share/share.module' ;
import { RouterModule , Router ,Routes } from '@angular/router' ;
import {UserLevelComponent} from './userLevel/userLevel.component';
import {ProductComponent} from './product/product.component';
import {ContractComponent} from './contract/contract.component';
const routes  : Routes = [
  {
    path : "product" ,
    component : ProductComponent ,
    data : {
      reuse : false ,
      title : "产品管理"
    }
  },{
    path: "userLevel",
    component: UserLevelComponent,
    data: {
      reuse : false ,
      title : "用户等级管理"
    }

  },{
    path : "contract" ,
    component : ContractComponent ,
    data : {
      reuse : false ,
      title : "合同管理"
    }
  },
];
const component = [
  ProductComponent,
  UserLevelComponent ,
  ContractComponent
];
@NgModule({
  declarations : [
    ...component
  ],
  imports: [
    ShareModule,
    NgZorroAntdModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  bootstrap: []
})
export class ProductCenterModule{ };
