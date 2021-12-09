import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE } from '../shared/constants/consts';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  constructor(private http: HttpClient) {}

  getAllUsers(filterString: string) {
    return this.http.get(`${API_BASE}/users${filterString}`).toPromise();
  }

  getOneUser(id: string) {
    return this.http.get(`${API_BASE}/users/${id}`).toPromise();
  }

  createUser(body: any) {
    return this.http.post(`${API_BASE}/users`, body).toPromise();
  }

  updateUser(body: any) {
    return this.http.put(`${API_BASE}/users/${body.id}`, body).toPromise();
  }
}
