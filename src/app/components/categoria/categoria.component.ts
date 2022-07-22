import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModelCategoria } from 'src/app/model/categoria.model';
import { CategoriaService } from 'src/app/service/categoria.service';

import Swal from 'sweetalert2';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import jsPDF from 'jspdf';

import * as FileSaver from 'file-saver';
import autoTable from 'jspdf-autotable'; 

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
  ///new
  styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
    providers: [MessageService,ConfirmationService]
    /// new
})
export class CategoriaComponent implements OnInit {

  categorias: ModelCategoria [] = [];
  
  public form! : FormGroup;
  
  id_categoria: any
  searchTerm: string =''

  cols: any[] = [];

  exportColumns: any[] = [];
 
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

    this.cols = [
      { field: 'cat_id', header: 'Id', customExportHeader: 'CategoríaId' },
      { field: 'cat_nombre', header: 'Nombre' }
    ];

    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }
    ))
    
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

  buscar(){
    console.log(this.searchTerm)
  }


  public actualizarCategoria(cat_id: any) {
    Swal.fire({
      position:'center',
      icon:'success',
      title:'Categoría actualizada exitosamente',
      showConfirmButton:false,
      timer:1500
    })
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
//////
public actualizarCategoria2() {
  Swal.fire({
    position:'center',
    icon:'success',
    title:'Categoría actualizada exitosamente',
    showConfirmButton:false,
    timer:1500
  })
  this.informacionCategoria.cat_id=this.id_categoria
  this.informacionCategoria.cat_nombre=this.form.value.cat_nombre

  this.categoriaService.putUpdateCat(this.informacionCategoria).subscribe(respuesta=>{
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
      confirmButtonText: 'Sí, deseo eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.deleteCat({
          cat_id: cat_id
        }).subscribe(res => {
          console.log('Categoría eliminada correctamente.')
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



  public infoUpdateCategoria(cat_id: any, cat_nombre: any) {
    this.informacionCategoria.cat_id = cat_id;
    this.informacionCategoria.cat_nombre = cat_nombre;
  }

  infoCategoria2(categoria:any){
    this.form.controls['cat_id'].disable()
    this.id_categoria=categoria.cat_id
    this.form.controls['cat_id'].setValue(categoria.cat_id)
    this.form.controls['cat_nombre'].setValue(categoria.cat_nombre)

  }

  exportPdf() {

    import("jspdf").then(jsPDF => {
     import("jspdf-autotable").then(x => {
         const doc = new jsPDF.default();
         (doc as any).autoTable(this.exportColumns,this.categorias)
         doc.save('categorias.pdf');
     })
 })
   
 }


}