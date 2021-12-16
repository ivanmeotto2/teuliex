import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OLD_API_BASE } from '../shared/constants/consts';

@Injectable({
	providedIn: 'root',
})
export class UsersApiService {
	constructor(private http: HttpClient) {}

	getAllUsers(filterString: string) {
		return this.http.get(`${OLD_API_BASE}/users${filterString}`).toPromise();
	}

	getOneUser(id: string) {
		return this.http.get(`${OLD_API_BASE}/users/${id}`).toPromise();
	}

	createUser(body: any) {
		return this.http.post(`${OLD_API_BASE}/users`, body).toPromise();
	}

	updateUser(body: any) {
		return this.http.put(`${OLD_API_BASE}/users/${body.id}`, body).toPromise();
	}
}
