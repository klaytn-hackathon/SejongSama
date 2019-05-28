import { DataSharingService } from 'app/shared/services/data-sharing.service';
import { LogoutComponent } from './core/logout/logout.component';
import { AccountService } from './shared/services/account.service';
import { MappingService } from './shared/utils/mapping.service';
import { FormatTimePipe } from './shared/pipes/format-time.pipe';
import { FormsModule } from '@angular/forms';
import { AppErrorHandler } from './app.error-handler';
import { routing } from './app.routing';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastyModule } from 'ng2-toasty';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2OrderModule } from 'ng2-order-pipe'; 
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';

import { NotificationService } from './shared/utils/notification.service';
import { ConfigService } from './shared/utils/config.service';
import { DataService } from './shared/services/data.service';
import { CavService } from './shared/services/cav.service';
import { ItemsService } from './shared/utils/item.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './core/header/header.component';
import { HomeComponent } from './core/home/home.component';
import { CountdownComponent } from './countdown/countdown.component';
import { InfoModalComponent } from './myhistory/modals/info-modal';
import { ConfirmBetModalComponent } from './shared/modals/confirm-bet-modal';
import { MyhistoryComponent } from './myhistory/myhistory.component';
import { HowtoComponent } from './howto/howto.component';
import { DailyscheduleComponent } from './dailyschedule/dailyschedule.component';
import { InfopanelComponent } from './infopanel/infopanel.component';
import { LoginComponent } from './core/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    HeaderComponent,
    HomeComponent,
    CountdownComponent,
    FormatTimePipe,
    ConfirmBetModalComponent,
    InfoModalComponent,
    MyhistoryComponent,
    HowtoComponent,
    DailyscheduleComponent,
    InfopanelComponent    
  ],
  imports: [
    routing,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,     
    HttpClientModule, 
    NgxPaginationModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
    InputTextModule,
    TooltipModule,
    DialogModule,
    TabViewModule,
    CardModule,
    ToastyModule.forRoot(),
    ModalModule.forRoot(), 
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [
    Title,   
    DataService,  
    ConfigService,
    NotificationService,  
    CavService,
    AccountService,
    ItemsService,
    DataSharingService,
    MappingService,
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
