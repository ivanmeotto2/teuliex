import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsService } from 'src/app/shared/services/news.service';
import { NewsDetailsPage } from './news-details.page';

const routes: Routes = [
  {
    path: '',
    component: NewsDetailsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [NewsService],
})
export class NewsDetailsPageRoutingModule {}
