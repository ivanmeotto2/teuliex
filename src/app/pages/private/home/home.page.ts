import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicSlides } from '@ionic/angular';
import { News } from 'src/app/shared/interfaces/news';
import { NewsService } from 'src/app/shared/services/news.service';
import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar } from 'swiper';

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, IonicSlides]);

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  news: News[] = new Array<News>();
  latestNews: News[] = new Array<News>();
  constructor(private router: Router, private newsService: NewsService) {}

  async ionViewWillEnter() {
    Object.assign(this.news, await this.newsService.getAllNews());
    Object.assign(this.latestNews, await this.newsService.getLatestNews(4));
  }

  openNews(id: string) {
    this.router.navigate(['private', 'news', id]);
  }
}
