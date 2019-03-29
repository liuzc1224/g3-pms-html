import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { ShareModule } from '../share/share.module' ;
import { RouterModule , Router ,Routes } from '@angular/router' ;
import {Channelh5Component} from './h5/channelh5.component';
import { ChannelBranchComponent } from './channelBranch/channelBranch.component';
import {ChannelListComponent} from "./channelList/channelList.component"
const routes  : Routes = [
  {
    path: "channelList",
    component: ChannelListComponent,
    data: {
      reuse: false,
      title: "渠道邀请码推广管理"
    }
  },
  {
    path : "h5" ,
    component : Channelh5Component ,
    data : {
      reuse : false ,
      title : "渠道H5推广管理"
    }
  },{
    path: "channelBranch",
    component: ChannelBranchComponent,
    data: {
      reuse : false ,
      title : "渠道分支"
    }
  }
];
const component = [
  ChannelListComponent,
  ChannelBranchComponent,
  Channelh5Component
  // SettingComponent
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
export class ChannelModule{ };
