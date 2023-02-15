import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReactiveFormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { AuthService } from 'src/app/services/auth-service.service';
import { NzMessageModule } from 'ng-zorro-antd/message';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    NzMessageModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,


  ],
  providers:[AuthService]
})
export class LoginModule { }
