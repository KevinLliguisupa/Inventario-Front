import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjusteComponent } from './components/ajuste/ajuste.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { CreateAjusteComponent } from './components/create-ajuste/create-ajuste.component';
import { ProductoComponent } from './components/producto/producto.component';

const routes: Routes = [
  { path:'categorias',component:CategoriaComponent},
  { path:'productos',component:ProductoComponent},
  { path:'ajustes',component:AjusteComponent},
  { path:'ajustes/create',component:CreateAjusteComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
