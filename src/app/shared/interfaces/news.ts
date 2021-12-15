export interface NewsInterface {
  newsId: string;
  imgs: string[];
  title: string;
  subtitle?: string;
  content: string;
  dataPubblicazione: Date;
  tags: any[];
  isEvent: boolean;
  needsLogin: boolean;
}

export class News implements NewsInterface {
  newsId: string = '';
  imgs: string[] = [];
  title: string = '';
  subtitle?: string = '';
  content: string = '';
  dataPubblicazione: Date = new Date();
  tags: any[] = [];
  isEvent: boolean = false;
  needsLogin: boolean = false

  constructor(res?: any) {
    Object.assign(this, res);
  }
}
