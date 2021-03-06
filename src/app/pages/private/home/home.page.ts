import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, IonRefresher, LoadingController, ModalController } from '@ionic/angular';
import { News } from 'src/app/shared/interfaces/news';
import { NewsService } from 'src/app/shared/services/news.service';
import { BehaviorsService } from 'src/app/shared/services/filters.service';
import { User } from 'src/app/shared/interfaces/user';
import { EventRegistrationModalComponent } from '../../../shared/components/event-registration-modal/event-registration-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  user: User = new User();
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  news: News[] = new Array<News>();
  defaultImage: string;
  loading: HTMLIonLoadingElement;
  pageNumber: number = 1;
  userIsLogged: boolean = false;

  constructor(
    private router: Router,
    private newsService: NewsService,
    private loadingCtrl: LoadingController,
    private behaviorsService: BehaviorsService,
    private modalController: ModalController
  ) {
    this.defaultImage = './../../../../assets/images/no_image.jpeg';
    this.behaviorsService.user.subscribe((userValue) => {
      this.user = userValue;
      if (this.user.id) this.userIsLogged = true;
      else this.userIsLogged = false;
    });
  }

  async ionViewWillEnter() {
    await this.retrieveNews();
  }

  async retrieveNews(refresher?: any) {
    this.news = [];
    this.pageNumber = 1;
    if (!refresher) {
      this.loading = await this.loadingCtrl.create({
        message: 'Retrieving news. Please wait...',
      });
      await this.loading.present();
    }
    this.news = await this.newsService.getAllNews(this.pageNumber);
    this.news = this.filterNews(this.news);
    if (refresher) await refresher.target.complete();
    else await this.loading.dismiss();
  }

  openNews(id: string) {
    this.router.navigate(['private', 'news', id]);
  }

  async dismissLoading() {
    await this.loading.dismiss();
  }

  async retrieveMoreNews(event: any) {
    this.pageNumber++;
    let moreNews = await this.newsService.getAllNews(this.pageNumber);
    moreNews = this.filterNews(moreNews);
    if (moreNews.length > 0) {
      this.news = this.news.concat(moreNews);
      event.target.complete();
    } else {
      this.infiniteScroll.disabled = true;
    }
  }

  filterNews(news: News[]) {
    let tempNews: News[] = [];
    if (!this.userIsLogged) {
      news.forEach((notizia) => {
        if (!notizia.needsLogin && !notizia.isEvent) tempNews.push(notizia);
      });
    } else {
      tempNews = news;
    }
    return tempNews;
  }

  async openEventRegistration(news: News) {
    const modal = await this.modalController.create({
      component: EventRegistrationModalComponent,
      componentProps: {
        event: news,
      },
    });
    await modal.present();
  }
}
