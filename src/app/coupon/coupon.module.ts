import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { ShareModule } from '../share/share.module' ;
import { RouterModule , Router ,Routes } from '@angular/router' ;
import {ListComponent} from './list/list.component';
import {SettingComponent} from './setting/setting.component';
const routes  : Routes = [
  {
    path : "list" ,
    component : ListComponent ,
    data : {
      reuse : false ,
      title : "优惠券管理"
    }
  },{
    path: "setting",
    component: SettingComponent,
    data: {
      reuse : false ,
      title : "设置优惠券"
    }

  }
];
const component = [
  ListComponent ,
  SettingComponent
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
export class CouponModule{ };
