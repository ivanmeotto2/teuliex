export enum TABS_NAME {
  home = 'News',
  map = 'Trova ex allievo',
  card = 'Tessera ex allievo',
  settings = 'Impostazioni',
  profile = 'Profilo',
  'stato-quote' = 'Stato Quote',
  credits = 'Crediti',
}

export const OLD_API_BASE = 'https://61a77dce387ab200171d2d20.mockapi.io';

export const API_BASE = 'https://www.teuliex.com/rest';

export const STRIPE_KEY = 'pk_test_51K7FH4LE83ts9xqAyXNnc4m2PCuCZxiqwzJEXc9PI2piknQG1kgzeMTlaBMmi2r0pAiEP5c3AGhr8mOy0q8KYqQB00SyE8kxX9';

export const MENU_OPTIONS = [
  {
    name: 'News',
    path: '/private/home',
    icon: 'newspaper-outline',
    needsLogin: false,
    needsQuoteInRegola: false,
  },
  {
    name: 'Trova ex allievo',
    path: '/private/map',
    icon: 'map-outline',
    needsLogin: true,
    needsQuoteInRegola: true,
  },
  {
    name: 'Tessera ex allievo',
    path: '/private/card',
    icon: 'card-outline',
    needsLogin: true,
    needsQuoteInRegola: true,
  },
  {
    name: 'Stato quote',
    path: '/private/stato-quote',
    icon: 'document-text-outline',
    needsLogin: true,
    needsQuoteInRegola: false,
  },
  {
    name: 'Crediti',
    path: '/private/credits',
    icon: 'brush-outline',
    needsLogin: false,
    needsQuoteInRegola: false,
  },
  {
    name: 'Impostazioni',
    path: '/private/settings',
    icon: 'settings-outline',
    needsLogin: true,
    needsQuoteInRegola: false,
  },
];

export const SETTINGS = [
  {
    name: 'Notifiche push',
    ngModel: 'user.notifichePush',
    description: 'Testo di prova',
  },
  {
    name: 'Mostra email',
    ngModel: 'user.mostraEmail',
    description: 'Testo di prova',
  },
  {
    name: 'Mostra numero di telefono',
    ngModel: 'user.mostraNumTel',
    description: 'Testo di prova',
  },
  {
    name: 'Fatti trovare',
    ngModel: 'user.fattiTrovare',
    description: 'Testo di prova',
  },
];
