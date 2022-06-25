import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  apiUrl:string="https://api-modulo-inventario.herokuapp.com"

  constructor(private http:HttpClient) { }
  
  public getProductos(){
    const url=this.apiUrl+`/productos`
    return this.http.get(url)
  }
}
