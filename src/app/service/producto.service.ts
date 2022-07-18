import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  apiUrl:string="http://localhost:4000"

  constructor(private http:HttpClient) { }
  
  public getProductos(){
    const url=this.apiUrl+`/productos`
    return this.http.get(url)
  }

  public getAllProductos(){
    const url=this.apiUrl+`/allproductos`
    return this.http.get(url)
  }

  public getProductosById(pro_id:any){
    const url = '/productos/id/'+pro_id;
    return this.http.get(url)
  }
}
