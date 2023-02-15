import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzFormModule } from 'ng-zorro-antd/form';
import { EditComponent } from './edit.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [EditComponent],
  imports: [
    CommonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzListModule,
    NzGridModule,
    NzMessageModule,
    NzSelectModule,
    NzDatePickerModule,
    NzIconModule,
    NzSelectModule,
    NzIconModule,
    NzAvatarModule,
    NzUploadModule,
    NzSpinModule,
    PdfViewerModule,
    
  ],
  exports:[
    NzUploadModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzListModule,
    NzGridModule,
    NzMessageModule,
    NzSelectModule,
    NzDatePickerModule,
    NzIconModule,
    NzSelectModule,
    NzIconModule,
    NzAvatarModule,
    EditComponent,
    NzSpinModule
  ],
  
})
export class EditModule { }
