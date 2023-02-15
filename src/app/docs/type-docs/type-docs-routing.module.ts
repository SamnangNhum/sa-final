import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeDocsComponent } from './type-docs.component';

const routes: Routes = [{ path: '', component: TypeDocsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatDocsRoutingModule { }
