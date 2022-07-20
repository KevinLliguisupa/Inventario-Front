import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  apiUrl:string="https://api-modulo-inventario.herokuapp.com"
  //apiUrl:string="http://localhost:4000"

  constructor(private http:HttpClient) { }
  
  public getCategorias(){
    const url=this.apiUrl+`/categorias`
    return this.http.get(url)
  }

  // public getCategoriaById(pro_id:any){
  //   const url = '/categorias/id/'+cat_id;
  //   return this.http.get(url)
  // }

  // public getCategoriaByName(pro_nombre:any){
  //   const url=this.apiUrl+`/categorias/nombre/`+cat_nombre;
  //   return this.http.get(url)
  // }

  public postCreateCat(body:any){
    const url=this.apiUrl+`/categorias/`
    return this.http.post(url,body)
  }

  public putUpdateCat(body:any){
    const url=this.apiUrl+`/categorias/`
    return this.http.put(url,body)

  }
  public deleteCat(body:any){
    const url=this.apiUrl+`/categorias/delete/`
    return this.http.put(url,body)

  }
}