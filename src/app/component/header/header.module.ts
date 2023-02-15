import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { RightComponent } from './right/right.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ProfileModule } from 'src/app/users/profile-users/profile.module';


@NgModule({
  declarations: [SearchComponent , RightComponent],
  imports: [
    CommonModule,
    NzInputModule,
    NzGridModule,
    NzIconModule,
    NzAutocompleteModule,
    NzBadgeModule,
    NzAvatarModule,
    NzDropDownModule,
    FormsModule,
    NzModalModule,
    ProfileModule
  ],
  exports:[
    SearchComponent,
    RightComponent
  ]
})
export class HeaderModule { }
