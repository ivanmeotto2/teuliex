import { Injectable } from '@angular/core';
import { NewsApiService } from '../../api/news-api.service';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private newsApiService: NewsApiService) {}

  async getAllNews() {
    const retrievedNews = await this.newsApiService.getAllNews();
    return retrievedNews;
  }

  async getLatestNews(count: number) {
    const retrievedNews = await this.newsApiService.getLatestNews(count);
    return retrievedNews;
  }

  async getOneNews(id: string) {
    const news = await this.newsApiService.getOneNews(id);
    return news[0];
  }

  async getTags() {}
}
