import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { News } from 'src/app/shared/interfaces/news';
import { NewsService } from 'src/app/shared/services/news.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  news: News[] = new Array<News>();
  defaultImage: string;
  loading: HTMLIonLoadingElement;
  pageNumber: number = 1;

  constructor(private router: Router, private newsService: NewsService, private loadingCtrl: LoadingController) {
    this.defaultImage = './../../../../assets/images/no_image.jpeg';
  }

  async ionViewWillEnter() {
    this.loading = await this.loadingCtrl.create({
      message: 'Retrieving news. Please wait...',
    });
    await this.loading.present();
    this.news = await this.newsService.getAllNews(this.pageNumber);
  }

  openNews(id: string) {
    this.router.navigate(['private', 'news', id]);
  }

  async dismissLoading() {
    await this.loading.dismiss();
  }

  async retrieveMoreNews(event: any) {
    this.pageNumber++;
    const moreNews = await this.newsService.getAllNews(this.pageNumber);
    if (moreNews.length > 0) {
      this.news = this.news.concat(moreNews);
      event.target.complete();
    } else {
      this.infiniteScroll.disabled = true;
    }
  }
}
