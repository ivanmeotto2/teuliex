import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'private/home',
    pathMatch: 'full',
  },
  {
    path: 'auth/login',
    loadChildren: () =>
      import('./pages/public/login/login.module').then(
        (m) => m.LoginPageModule
      ),
  },
  {
    path: 'auth/sign-up',
    loadChildren: () =>
      import('./pages/public/sign-up/sign-up.module').then(
        (m) => m.SignUpPageModule
      ),
  },
  {
    path: 'auth/cambia-password',
    loadChildren: () =>
      import('./pages/public/recupera-password/recupera-password.module').then(
        (m) => m.RecuperaPasswordPageModule
      ),
  },
  {
    path: 'private',
    loadChildren: () =>
      import('./pages/private/private.module').then((m) => m.PrivatePageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
