import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

export const appConfig = {
  providers:[
  importProvidersFrom(RouterModule.forRoot(routes)), // <-- provide router
  provideHttpClient() // if you use HttpClient anywhere
]};
