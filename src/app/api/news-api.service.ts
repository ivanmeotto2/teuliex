import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE } from '../shared/constants/consts';

@Injectable({
  providedIn: 'root',
})
export class NewsApiService {
  constructor(private http: HttpClient) {}

  getAllNews() {
    return this.http
      .get(`${API_BASE}/news?sortBy=dataPubblicazione&order=asc`)
      .toPromise();
  }

  getLatestNews(count: number) {
    return this.http
      .get(
        `${API_BASE}/news?sortBy=dataPubblicazione&order=asc&page=1&limit=${count}`
      )
      .toPromise();
  }

  getOneNews(id: string) {
    return this.http.get(`${API_BASE}/news?newsId=${id}`).toPromise();
  }

  getTags() {
    return this.http.get(`${API_BASE}/tags`).toPromise();
  }
}
