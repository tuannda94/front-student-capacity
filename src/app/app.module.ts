import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule} from 'angularx-social-login';
import {environment} from 'src/environments/environment';
import {LoginComponent} from './auth/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import {ErrorInterceptor} from './_helpers/error.interceptor';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {HomeLayoutComponent} from './layouts/home-layout/home-layout.component';
import {BannerComponent} from './component/banner/banner.component';
import {BackTimeComponent} from './component/back-time/back-time.component';

import {BackTopComponent} from './component/back-top/back-top.component';



import {LoadingItemComponent} from './component/loading-item/loading-item.component';
import {TypeExamPipe} from './helper/pipe/type-exam.pipe';
import {FormatDatePipe} from './helper/pipe/format-date.pipe';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {MaterialModule} from './material/material.module';
import {NgToastModule} from 'ng-angular-popup';
import {ProfileUserComponent} from './component/profile-user/profile-user.component';
import {LoadingPageComponent} from './loading/loading-page/loading-page.component';

import {NZ_I18N} from 'ng-zorro-antd/i18n';
import {en_US} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {HeaderComponent} from './layouts/header/header.component';
import {FooterComponent} from './layouts/footer/footer.component';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzSpinModule} from 'ng-zorro-antd/spin';

registerLocaleData(en);


import {CapacityExamComponent} from './pages/capacity-exam/capacity-exam.component';
import {DialogConfirmComponent} from './modal/dialog-confirm/dialog-confirm.component';
import {CapacityDetailComponent} from './pages/capacity-detail/capacity-detail.component';
import {CapacityRelatedItemComponent} from './component/capacity-related-item/capacity-related-item.component';
import {TestCapacityComponent} from "./pages/test-capacity/test-capacity.component";
import {InfoTeamComponent} from "./pages/info-team/info-team.component";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HomeLayoutComponent,
    BannerComponent,
    BackTimeComponent,
    BackTopComponent,
    LoadingItemComponent,
    TypeExamPipe,
    FormatDatePipe,
    ProfileUserComponent,
    LoadingPageComponent,
    HeaderComponent,
    FooterComponent,
    CapacityExamComponent,
    DialogConfirmComponent,
    CapacityDetailComponent,
    CapacityRelatedItemComponent,
    TestCapacityComponent,
    InfoTeamComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    HttpClientModule,
    CarouselModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    SlickCarouselModule,
    NgxSkeletonLoaderModule,
    MaterialModule,
    NgToastModule,
    NzSelectModule,
    NzSpinModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GG_CLIENT_ID),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {provide: NZ_I18N, useValue: en_US}
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
