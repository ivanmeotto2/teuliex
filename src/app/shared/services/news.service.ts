import { Injectable } from '@angular/core';
import { NewsApiService } from '../../api/news-api.service';
import { News } from 'src/app/shared/interfaces/news';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private newsApiService: NewsApiService) {}

  async getAllNews(page: number): Promise<News[]> {
    const retrievedNews = (await this.newsApiService.getAllNews(page)) as News[];
    return retrievedNews;
  }

  async getOneNews(id: string) {
    const news = await this.newsApiService.getOneNews(id);
    return news[0];
  }

  async getTags() {}
}
