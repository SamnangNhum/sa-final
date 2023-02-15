import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddNewRoutingModule } from './add-new-routing.module';
import { AddNewComponent } from './add-new.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageModule } from 'ng-zorro-antd/message';

@NgModule({
  declarations: [
    AddNewComponent
  ],
  imports: [
    CommonModule,
    AddNewRoutingModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzGridModule,
    NzDividerModule,
    NzDatePickerModule,
    NzAvatarModule,
  NzUploadModule,
  NzMessageModule 
  ]
})
export class AddNewModule { }
