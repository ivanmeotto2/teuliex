import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE } from '../shared/constants/consts';

@Injectable({
  providedIn: 'root'
})
export class QuotesApiService {

  constructor(private http: HttpClient) { }

   getQuotesById(id: string) {
    return this.http.get(`${API_BASE}/quote?userID=${id}`).toPromise()
  }
}
