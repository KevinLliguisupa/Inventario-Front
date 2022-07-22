import { Component, OnInit } from '@angular/core';
import { ModelCategoria } from 'src/app/model/categoria.model'; 
import { CategoriaService } from 'src/app/service/categoria.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

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
    this.categoriaService.getAllCategorias().subscribe(
      (categoria:any)=>{
        for (let i = 0; i < categoria.length; i++) {
          const item = categoria[i];
          if (item.cat_estado) {
            item.estEti="Activo"
          }else{
            item.estEti="Inactivo"
          }
        }
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
    Swal.fire({
      title: '¿Está seguro de borrar?',
      text: "No podrá revertir esta acción!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#91C788',
      cancelButtonColor: '#FFAAA7',  
      confirmButtonText: 'Si, deseo eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.deleteCat({
          cat_id: cat_id
        }).subscribe(res => {
          console.log('Categoria eliminada correctamente.')
          this.form.reset();
          this.cargarCategorias()
        })

        Swal.fire(
          'Eliminada!',
          'La categoría ha sido eliminada.',
          'success'
        )
      }
    })
  }


  public cambiarEstado(categoria: ModelCategoria) {
    if (categoria.cat_estado) {
      Swal.fire({
        title: '¿Está seguro de desactivar?',
        text: "Esta acción ocultara este ítem de otros apartados del sistema",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#91C788',
        cancelButtonColor: '#FFAAA7',
        confirmButtonText: 'Si, deseo desactivarlo!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.categoriaService.deleteCat({
            cat_id: categoria.cat_id
          }).subscribe(res => {
            console.log('Categoria desactivada correctamente.')
            this.cargarCategorias()
          })

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cambiado!',
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
    } else {
      Swal.fire({
        title: '¿Está seguro de activar?',
        text: "Esta acción mostrará este ítem de otros apartados del sistema",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#91C788',
        cancelButtonColor: '#FFAAA7',
        confirmButtonText: 'Si, deseo activarlo!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.categoriaService.activateCat({
            cat_id: categoria.cat_id
          }).subscribe(res => {
            console.log('Categoria activada correctamente.')
            this.cargarCategorias()
          })

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cambiado!',
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
    }
  }


  public infoUpdateCategoria(cat_id: any, cat_nombre: any) {
    this.informacionCategoria.cat_id = cat_id;
    this.informacionCategoria.cat_nombre = cat_nombre;
  }

}
