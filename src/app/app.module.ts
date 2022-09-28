import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { CategoryComponent } from './pages/category/category.component';
import { SubCategoryComponent } from './pages/sub-category/sub-category.component';
import { AdminDocumentComponent } from './pages/admin-document/admin-document.component';
import { CommonModule } from '@angular/common';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ViewDocumentComponent } from './pages/view-document/view-document.component';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import {NgxPaginationModule} from 'ngx-pagination';
import { ReportsComponent } from './pages/reports/reports.component';
@NgModule({

  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    FooterComponent,
    CategoryComponent,
    SubCategoryComponent,
    AdminDocumentComponent,
    ViewDocumentComponent,
    ReportsComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    HttpClientModule,
    CommonModule,
    FormsModule,
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ReactiveFormsModule,
    NgxDocViewerModule,
    NgxPaginationModule,
  ],

  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule {
}
