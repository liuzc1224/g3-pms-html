import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from './service/storage';
import { EnumService } from './service/enum/enum.service';

@Component({
  selector: 'app-root',
  template: `<div style='height:100%;'>
    <router-outlet></router-outlet>
  </div>`,
  styles: ['']
})
export class AppComponent {
  constructor(
    private translate: TranslateService,
    private sgo: SessionStorageService,
    private enumSer: EnumService
  ) {

    let suportLocale = this.enumSer.getLocale();

    let broswerLang = window.navigator.language.replace("-", "_");

    let isSuport = null;

    suportLocale.forEach(item => {
      if (item.code == broswerLang) {
        isSuport = item.code;
        return false;
      }
    });

    let locale = isSuport ? isSuport : "zh_CN";

    // let locale = 'zh_CN';
    console.log('locale',locale);

    this.sgo.set("locale", locale);

    translate.setDefaultLang('zh_CN');

    translate.getTranslation(locale)
      .subscribe(
        res => {
          this.sgo.set("lang", res);
        }
      );
  };

};
