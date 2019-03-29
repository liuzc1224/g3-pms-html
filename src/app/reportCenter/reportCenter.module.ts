import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { ShareModule } from '../share/share.module' ;
import { RouterModule , Router ,Routes } from '@angular/router' ;
import { channeldataComponent } from './channeldata/channeldata.component';
const routes  : Routes = [
    {
        path : "channeldata" ,
        component : channeldataComponent ,
        data : {
            reuse : false ,
            title : "渠道数据监测"
        }
    }
];

const component = [
    channeldataComponent ,
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
export class ReportCenterModule{ };
