import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule, NZ_I18N, zh_CN , pt_BR } from 'ng-zorro-antd';
import { AppComponent } from './app.component';
import { HttpClientModule , HttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import pt from '@angular/common/locales/pt';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RoutesModule } from './routes/route.module';
import { ShareModule } from './share/share.module';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

const I18nLoader = function(http : HttpClient){
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

const object = {
  "zh_CN" : zh_CN ,
  "pt_BR" : pt_BR
};
const lang = object[window.navigator.language.replace("-" , "_")] ? object[window.navigator.language.replace("-" , "_")] : zh_CN ;
if( window.navigator.language.replace("-" , "_") === 'pt_BR'){
  registerLocaleData(pt);
  lang['Pagination'] = {
    items_per_page: "artículos/hojas" ,
    jump_to: "siguente" ,
    jump_to_confirm: "confirmar" ,
    next_3: "siguente 3 hojas" ,
    next_5: "siguente 5 hojas" ,
    next_page: "siguente" ,
    page: "hoja" ,
    prev_3: "anterior 3 hojas" ,
    prev_5: "anterior 5 hojas" ,
    prev_page: "anterior"
  };

}else{
  registerLocaleData(zh);
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule ,
    RoutesModule ,
    ShareModule ,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (I18nLoader),
          deps: [ HttpClient ]
      }
    }),
  ],
  bootstrap: [ AppComponent ],
  providers   : [ { provide: NZ_I18N, useValue: lang } , {provide: LocationStrategy, useClass: HashLocationStrategy}]
})
export class AppModule { }
