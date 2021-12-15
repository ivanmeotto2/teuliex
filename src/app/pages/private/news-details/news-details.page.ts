import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { News } from 'src/app/shared/interfaces/news';
import { NewsService } from 'src/app/shared/services/news.service';
import { LoadingController } from '@ionic/angular';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';

@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.page.html',
  styleUrls: ['./news-details.page.scss'],
})
export class NewsDetailsPage {
  id: string;
  news: News = new News();

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private loadingController: LoadingController,
    private photoViewer: PhotoViewer
  ) {}

  async ionViewWillEnter() {
    const loading = await this.loadingController.create({
      message: 'Retrieving news...',
    });
    await loading.present();
    this.id = this.route.snapshot.paramMap.get('id');
    const retrievedOne = await this.newsService.getOneNews(this.id);
    Object.assign(this.news, retrievedOne);
    await loading.dismiss();
  }

  openFullscreenImage(img: string) {
    this.photoViewer.show(img)
  }
}
