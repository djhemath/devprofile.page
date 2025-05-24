import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./pages/auth/auth.component').then(mod => mod.AuthComponent),
    },
    {
        path: '',
        canActivate: [() => inject(AuthGuard).canActivate()],
        loadChildren: () =>
        import('./pages/console/console.route').then((m) => m.routes),
    },
    {
        path: '**',
        redirectTo: '',
    },
];
