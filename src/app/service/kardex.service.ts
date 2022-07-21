import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
    providedIn: 'root'
})
export class kardexService {

    apiUrl: string = "http://localhost:4000"

    constructor(private http: HttpClient) { }

    public getKardexById(pro_id: number) {
        const url = this.apiUrl + `/kardex/id/` + pro_id
        return this.http.get(url)
    }

}