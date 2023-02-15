import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatDocsComponent } from './cat-docs.component';

const routes: Routes = [{ path: '', component: CatDocsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatDocsRoutingModule { }
