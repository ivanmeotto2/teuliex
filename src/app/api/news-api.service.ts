import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE, OLD_API_BASE } from '../shared/constants/consts';

@Injectable({
  providedIn: 'root',
})
export class NewsApiService {
  constructor(private http: HttpClient) {}

  getAllNews(page: number) {
    const today = new Date();
    return this.http.get(`${OLD_API_BASE}/news?sortBy=dataPubblicazione&page=${page}&limit=10`).toPromise();
    // return this.http.get(`${API_BASE}/news?date_after=${formatDate(today, 'yyyy-MM-dd', 'en-US')}`).toPromise();
  }

  getOneNews(id: string) {
    return this.http.get(`${OLD_API_BASE}/news?newsId=${id}`).toPromise();
  }
}
