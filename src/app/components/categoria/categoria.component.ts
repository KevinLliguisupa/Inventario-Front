import { Component, OnInit } from '@angular/core';
import { ModelCategoria } from 'src/app/model/categoria.model'; 
import { CategoriaService } from 'src/app/service/categoria.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  categorias: ModelCategoria [] = [];
  
  public form! : FormGroup;
 
  public informacionCategoria={
    cat_id:-1,
    cat_nombre:""
  }

  constructor(private categoriaService: CategoriaService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  public cargarCategorias(){
    this.categoriaService.getCategorias().subscribe(
      (categoria:any)=>{
        this.categorias=categoria
        console.log(this.categorias)
      },
      (error)=>console.log(error)
    )
  }

}
