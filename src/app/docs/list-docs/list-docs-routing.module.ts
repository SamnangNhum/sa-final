import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDocsComponent } from './list-docs.component';

const routes: Routes = [{ path: '', component: ListDocsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListDocsRoutingModule { }
