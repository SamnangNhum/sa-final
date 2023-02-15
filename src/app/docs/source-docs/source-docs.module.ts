import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SourceDocsRoutingModule } from './source-docs-routing.module';
import { SourceDocsComponent } from './source-docs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';

@NgModule({
  declarations: [SourceDocsComponent],
  imports: [
    CommonModule,
    SourceDocsRoutingModule,
    ReactiveFormsModule,
    NzUploadModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzListModule,
    NzGridModule,
    NzMessageModule,
    NzSpaceModule,  
    NzDropDownModule,
    NzTableModule,
    FormsModule,
  ],
})
export class SourceDocsModule {}
