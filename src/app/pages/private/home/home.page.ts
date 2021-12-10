import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicSlides, LoadingController } from '@ionic/angular';
import { News } from 'src/app/shared/interfaces/news';
import { NewsService } from 'src/app/shared/services/news.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  news: News[] = new Array<News>();
  latestNews: News[] = new Array<News>();
  defaultImage: string;
  loading: HTMLIonLoadingElement;
  constructor(private router: Router, private newsService: NewsService, private loadingCtrl: LoadingController) {
    this.defaultImage = './../../../../assets/images/no_image.jpeg';
  }

  async ionViewWillEnter() {
    this.loading = await this.loadingCtrl.create({
      message: 'Retrieving news. Please wait...',
    });
    await this.loading.present();
    Object.assign(this.news, await this.newsService.getAllNews());
    Object.assign(this.latestNews, await this.newsService.getLatestNews(4));
  }

  openNews(id: string) {
    this.router.navigate(['private', 'news', id]);
  }

  async dismissLoading() {
    await this.loading.dismiss();
  }
}
