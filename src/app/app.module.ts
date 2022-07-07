import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { ProductoComponent } from './components/producto/producto.component';
import { AjusteComponent } from './components/ajuste/ajuste.component';
//////////////////////////

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import {TableModule} from 'primeng/table';
import {PanelModule} from 'primeng/panel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CardModule} from 'primeng/card';
import {DataViewModule} from 'primeng/dataview';
import {PaginatorModule} from 'primeng/paginator';

@NgModule({
  declarations: [
    AppComponent,
    CategoriaComponent,
    ProductoComponent,
    AjusteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

   // 
  TableModule,PanelModule,BrowserAnimationsModule,CardModule,DataViewModule,PaginatorModule
    //////////////,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }