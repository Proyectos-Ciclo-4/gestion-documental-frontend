import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './pages/category/category.component';
import { ListDocumentsComponent } from './pages/list-documents/list-documents.component';
import { LoginComponent } from './pages/login/login.component';
import { MenuAdminComponent } from './pages/menu-admin/menu-admin.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SubCategoryComponent } from './pages/sub-category/sub-category.component';
import { ViewDocumentComponent } from './pages/view-document/view-document.component';
import { ViewuniquedocumentComponent } from './pages/viewuniquedocument/viewuniquedocument.component';

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
  component: ViewDocumentComponent
},
{
  path: 'list-documents',
  component: ListDocumentsComponent
},
{
  path: 'reports',
  component: ReportsComponent
},
{
  path: 'viewdocument',
  component: ViewuniquedocumentComponent
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
