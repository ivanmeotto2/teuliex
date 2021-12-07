export enum TABS_NAME {
  home = 'News',
  map = 'Trova allievo',
  card = 'Tessera ex allievo',
  settings = 'Impostazioni',
  profile = 'Profilo',
  'stato-quote' = 'Stato Quote',
  credits = 'Crediti',
}

export const API_BASE = 'https://61a77dce387ab200171d2d20.mockapi.io/';

export const MENU_OPTIONS = [
  {
    name: 'News',
    path: '/private/home',
    icon: 'newspaper-outline',
    needsLogin: false,
  },
  {
    name: 'Trova ex allievo',
    path: '/private/map',
    icon: 'map-outline',
    needsLogin: true,
  },
  {
    name: 'Tessera ex allievo',
    path: '/private/card',
    icon: 'card-outline',
    needsLogin: true,
  },
  {
    name: 'Impostazioni',
    path: '/private/settings',
    icon: 'settings-outline',
    needsLogin: true,
  },
  {
    name: 'Stato quote',
    path: '/private/stato-quote',
    icon: 'document-text-outline',
    needsLogin: true,
  },
  {
    name: 'Crediti',
    path: '/private/credits',
    icon: 'brush-outline',
    needsLogin: false,
  },
];
