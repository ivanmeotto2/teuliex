import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { News } from 'src/app/shared/interfaces/news';
import { NewsService } from 'src/app/shared/services/news.service';
import { BehaviorsService } from 'src/app/shared/services/filters.service';
import { User } from 'src/app/shared/interfaces/user';

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
		private behaviorsService: BehaviorsService
	) {
		this.defaultImage = './../../../../assets/images/no_image.jpeg';
		behaviorsService.user.subscribe((userValue) => {
			this.user = userValue;
			if (this.user.id) this.userIsLogged = true;
			else this.userIsLogged = false;
		});
	}

	async ionViewWillEnter() {
		this.loading = await this.loadingCtrl.create({
			message: 'Retrieving news. Please wait...',
		});
		await this.loading.present();
		this.news = await this.newsService.getAllNews(this.pageNumber);
		this.news = this.filterNews(this.news);
		await this.loading.dismiss();
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
				if (!notizia.needsLogin) tempNews.push(notizia);
			});
		} else {
			tempNews = news;
		}
		return tempNews;
	}
}
