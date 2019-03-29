import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { ShareModule } from '../share/share.module' ;
import { RouterModule , Router ,Routes } from '@angular/router' ;
import { LoanListComponent } from './loanList/loanList.component' ;
import { RepayComponent } from './repay/repay.component' ;
const routes  : Routes = [
    {
        path : "loanList" ,
        component : LoanListComponent ,
        data : {
            reuse : true ,
            title : "Administración de prestar"
        }
    },{
		path : "repayList" ,
		component : RepayComponent ,
		data : {
			reuse : true ,
			title : "Administración de pagar"
		}
	}
];

const component = [
	LoanListComponent ,
	RepayComponent
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
export class FinanceModule{ };