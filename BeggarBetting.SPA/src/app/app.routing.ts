import { LogoutComponent } from './core/logout/logout.component';
import { LoginComponent } from './core/login/login.component';
import { HowtoComponent } from './howto/howto.component';
import { MyhistoryComponent } from './myhistory/myhistory.component';
import { Routes, RouterModule } from '@angular/router';
 
import { HeaderComponent } from "./core/header/header.component";
import { HomeComponent } from './core/home/home.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'dailybetting', pathMatch: 'full' },
    { path: 'dailybetting', component: HomeComponent },
    { path: 'myhistory', component: MyhistoryComponent },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'howto', component: HowtoComponent },
];
 
export const routing = RouterModule.forRoot(appRoutes);
 
export const routedComponents = [
    HeaderComponent,
    HomeComponent,  
    MyhistoryComponent,
    LoginComponent,
    LogoutComponent,
    HowtoComponent
];
//export const routedComponents = [AboutComponent, IndexComponent, ContactComponent, LoginComponent, RegisterComponent];