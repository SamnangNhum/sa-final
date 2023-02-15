import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewDocsComponent } from './add-new-docs.component';

const routes: Routes = [{ path: '', component: AddNewDocsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddNewDocsRoutingModule { }
