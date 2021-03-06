import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { ProductoComponent } from './components/producto/producto.component';
import { UpdateAjusteComponent } from './components/update-ajuste/update-ajuste.component';
import { CreateAjusteComponent } from './components/create-ajuste/create-ajuste.component';
import { AjusteComponent } from './components/ajuste/ajuste.component';


import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DataViewModule } from 'primeng/dataview';
import { PaginatorModule } from 'primeng/paginator';
import { FiltroproductoPipe } from './pipes/filtroproducto.pipe';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PickListModule } from 'primeng/picklist';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { KardexComponent } from './components/kardex/kardex.component';





@NgModule({
  declarations: [
    AppComponent,
    CategoriaComponent,
    ProductoComponent,
    AjusteComponent,
    FiltroproductoPipe,
    CreateAjusteComponent,
    UpdateAjusteComponent,
    KardexComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    PanelModule,
    BrowserAnimationsModule,
    CalendarModule,
    InputTextareaModule,
    PickListModule,
    CheckboxModule,
    ConfirmDialogModule,
    CardModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    DataViewModule,
    PaginatorModule,
    InputNumberModule,
    ButtonModule,
    RadioButtonModule,
    TriStateCheckboxModule,
    DropdownModule
  ],
  providers: [MessageService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }