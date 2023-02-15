import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListUsersRoutingModule } from './list-users-routing.module';
import { ListUsersComponent } from './list-users.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { EditModule } from 'src/app/component/user/edit/edit.module';



@NgModule({
  declarations: [
    ListUsersComponent
  ],
  imports: [
    CommonModule,
    ListUsersRoutingModule,
    EditModule,
    NzTableModule,
    NzDividerModule,
    NzSpaceModule,
    NzInputModule,
    NzModalModule,
    NzDropDownModule,
    NzButtonModule,
    FormsModule,
    NzIconModule,
    NzButtonModule,
    NzMessageModule,
    NzPaginationModule
  ]

})
export class ListUsersModule { }
