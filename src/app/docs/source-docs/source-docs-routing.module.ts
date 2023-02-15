import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SourceDocsComponent } from './source-docs.component';

const routes: Routes = [{ path: '', component: SourceDocsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SourceDocsRoutingModule { }
