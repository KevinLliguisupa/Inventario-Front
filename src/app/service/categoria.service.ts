import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  apiUrl:string="https://api-modulo-inventario.herokuapp.com"

  constructor(private http:HttpClient) { }
  
  public getCategorias(){
    const url=this.apiUrl+`/categorias`
    return this.http.get(url)
  }
}