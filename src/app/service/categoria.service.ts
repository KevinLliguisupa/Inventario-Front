import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
}) 
export class CategoriaService {

  apiUrl:string="https://api-modulo-inventario.herokuapp.com"
  // apiUrl:string="http://localhost:4000"

  
  constructor(private http:HttpClient) { }

  public getAllCategorias(){
    const url=this.apiUrl+`/allcategorias`
    return this.http.get(url)
  }
  
  public getCategorias(){
    const url=this.apiUrl+`/categorias`
    return this.http.get(url)
  }

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
  public activateCat(body:any){
    const url=this.apiUrl+`/categorias/activate/`
    return this.http.put(url,body)
  }
}