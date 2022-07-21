import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjusteComponent } from './components/ajuste/ajuste.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { CreateAjusteComponent } from './components/create-ajuste/create-ajuste.component';
import { KardexComponent } from './components/kardex/kardex.component';
import { ProductoComponent } from './components/producto/producto.component';
import { UpdateAjusteComponent } from './components/update-ajuste/update-ajuste.component';

const routes: Routes = [
  { path:'categorias',component:CategoriaComponent},
  { path:'productos',component:ProductoComponent},
  { path:'ajustes',component:AjusteComponent},
  { path:'ajustes/create',component:CreateAjusteComponent},
  { path:'ajustes/update/:aju_numero',component:UpdateAjusteComponent},
  { path:'kardex/id/:pro_id',component:KardexComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
