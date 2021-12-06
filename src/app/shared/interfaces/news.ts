export interface NewsInterface {
  newsId: string;
  imgs: string[];
  title: string;
  subtitle?: string;
  content: string;
  dataPubblicazione: Date;
  tags: any[];
}

export class News implements NewsInterface {
  newsId: string = '';
  imgs: string[] = [];
  title: string = '';
  subtitle?: string = '';
  content: string = '';
  dataPubblicazione: Date = new Date();
  tags: any[] = [];

  constructor(res?: any) {
    Object.assign(this, res);
  }
}
