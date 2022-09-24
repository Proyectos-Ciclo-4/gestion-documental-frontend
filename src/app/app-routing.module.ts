import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './pages/category/category.component';
import { LoginComponent } from './pages/login/login.component';
import { MenuAdminComponent } from './pages/menu-admin/menu-admin.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SubCategoryComponent } from './pages/sub-category/sub-category.component';
import { AdminDocumentComponent } from './pages/admin-document/admin-document.component';
import { ViewDocumentComponent } from './pages/view-document/view-document.component';

const routes: Routes = [{
  path: '',
  component: LoginComponent
},
{
  path: 'menu-admin',
  component: MenuAdminComponent
},
{
  path: 'category',
  component: CategoryComponent
},
{
  path: 'sub-category',
  component: SubCategoryComponent
},
{
  path: 'document',
  component: AdminDocumentComponent
},
{
  path: 'reports',
  component: ReportsComponent
},
{
  path: 'view-document',
  component: ViewDocumentComponent
},
{
  path: '**',
  component: PageNotFoundComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
