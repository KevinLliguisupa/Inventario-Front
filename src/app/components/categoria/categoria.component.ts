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
    this.cargarCategorias()
    this.form=this.formBuilder.group({
      cat_id:[''],
      cat_nombre:['']
    })
    
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

  public crearCategoria() {
    this.categoriaService.postCreateCat({
      cat_nombre: this.form.value.cat_nombre,
      cat_estado: this.form.value.cat_estado
    }
    ).subscribe(respuesta => {
      console.log('Categoria enviada');
      //Formulario reseteado
      this.form.reset();
      //Se cargue los datos despues de enviar
      this.cargarCategorias();
    }
    );
  }


  public actualizarCategoria(cat_id: any) {
    this.categoriaService.putUpdateCat({
      cat_id: cat_id,
      cat_nombre: this.form.value.cat_nombre,
      cat_estado: this.form.value.cat_estado
    }
    ).subscribe(respuesta => {
      //Se cargue los datos despues de enviar
      console.log('Categoria editada correctamente.')
      this.form.reset();
      this.cargarCategorias()
    }
    );
  }

  public borrarCategoria(cat_id: any) {
    this.categoriaService.deleteCat({
      cat_id: cat_id
    }).subscribe(res => {
      console.log('Categoria eliminada correctamente.')
      this.form.reset();
      this.cargarCategorias()
    })
  }



  public infoUpdateCategoria(cat_id: any, cat_nombre: any) {
    this.informacionCategoria.cat_id = cat_id;
    this.informacionCategoria.cat_nombre = cat_nombre;
  }

}
