import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { HeaderModule } from './component/header/header.module';
import { TokenInterceptorService } from './services/token-interceptor.service';



registerLocaleData(en);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HeaderModule,
    NzLayoutModule,
    NzInputModule,
    NzAffixModule,
    NzGridModule,
    NzIconModule,
    NzAutocompleteModule,
    NzMenuModule,

  ],
  exports: [],
  providers: [{provide:HTTP_INTERCEPTORS,useClass:TokenInterceptorService,multi:true} ],
  bootstrap: [AppComponent],
})
export class AppModule {}
