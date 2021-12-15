import { Injectable } from '@angular/core';
import { QuotesApiService } from '../../api/quotes-api.service';
import { Quotes } from '../interfaces/quotes';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {

  constructor(private quotesApiService: QuotesApiService) { }

  async getQuotesById(id: string) {
    const quotes = await this.quotesApiService.getQuotesById(id) as Quotes[];
    return quotes
  }
}
