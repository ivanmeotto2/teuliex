import { Injectable } from '@angular/core';
import { API_BASE } from '../shared/constants/consts';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get(`${API_BASE}/users`).toPromise();
  }

  createUser(body: any) {
    return this.http.post(`${API_BASE}/users`, body).toPromise();
  }
}
