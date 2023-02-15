import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guard/auth.guard';
import { LoginGuard } from './guard/login.guard';
import { RoleGuard } from './guard/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginModule),canActivate:[LoginGuard]
  },
  {
    path: 'docs/addNew',
    loadChildren: () =>
      import('./docs/add-new-docs/add-new-docs.module').then(
        (m) => m.AddNewDocsModule
      ),
  },
  {
    path: 'docs/list/:isApproved',
    loadChildren: () =>
      import('./docs/list-docs/list-docs.module').then((m) => m.ListDocsModule),
  },
  {
    path: 'users/list',
    loadChildren: () =>
      import('./users/list-users/list-users.module').then(
        (m) => m.ListUsersModule
      )
  },

  {
    path: 'users/addNew',
    loadChildren: () =>
      import('./users/add-users/add-new.module').then((m) => m.AddNewModule)
  },
  {
    path: 'add-new-docs',
    loadChildren: () =>
      import('./docs/add-new-docs/add-new-docs.module').then(
        (m) => m.AddNewDocsModule
      ),
  },
  {
    path: 'docs/category-docs',
    loadChildren: () =>
      import('./docs/cat-docs/cat-docs.module').then((m) => m.CatDocsModule),
  },
  {
    path: 'docs/type-docs',
    loadChildren: () =>
      import('./docs/type-docs/type-docs.module').then((m) => m.TypeDocsModule),
  },
  {
    path: 'docs/source-docs',
    loadChildren: () =>
      import('./docs/source-docs/source-docs.module').then(
        (m) => m.SourceDocsModule
      ),
  },
  {
    path: 'classroom',
    loadChildren: () =>
      import('./classroom/classroom.module').then((m) => m.OfficeModule)
  },


  //Wild Card Route for 404 request
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
