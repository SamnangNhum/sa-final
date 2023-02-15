import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListDocsRoutingModule } from './list-docs-routing.module';
import { ListDocsComponent } from './list-docs.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzFormModule } from 'ng-zorro-antd/form';
import { EditModule } from 'src/app/component/docs/edit/edit.module';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';


@NgModule({
  declarations: [
    ListDocsComponent
  ],
  imports: [
    CommonModule,
    EditModule,
    ListDocsRoutingModule,
    NzModalModule,
    NzSpaceModule,
    NzDropDownModule,
    NzButtonModule,
    NzTableModule,
    NzIconModule,
    NzInputModule,
    NzCheckboxModule,
    FormsModule,
    NzButtonModule,
    NzPopoverModule,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    NzPaginationModule
  ]
})
export class ListDocsModule { }
