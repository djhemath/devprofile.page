import { Routes } from '@angular/router';
import { ConsoleComponent } from './console.component';

export const routes: Routes = [
  {
    path: '',
    component: ConsoleComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: {
          label: 'Home',
          keyboardShortcut: 'H',
          isVisible: true,
        },
      },
      {
        path: 'site',
        data: {
          label: 'Site',
          keyboardShortcut: 'S',
          isVisible: true,
        },
        children: [
          {
            path: '',
            redirectTo: '/site/details',
            pathMatch: 'full',
          },
          {
            path: 'details',
            loadComponent: () => import('./site/site-details/site-details.component').then(m => m.SiteDetailsComponent),
            data: {
              label: 'Details',
              keyboardShortcut: '1',
              isVisible: true,
            },
          },
          {
            path: 'meta',
            loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
            data: {
              label: 'Meta',
              keyboardShortcut: '2',
              isVisible: true,
            },
          },
          {
            path: 'domain',
            loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
            data: {
              label: 'Domain',
              keyboardShortcut: '3',
              isVisible: true,
            },
          },
          {
            path: 'versions',
            loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
            data: {
              label: 'Versions',
              keyboardShortcut: '4',
              isVisible: true,
            },
          },
        ],
      },
      {
        path: 'analytics',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: {
          label: 'Analytics',
          keyboardShortcut: 'A',
          isVisible: false,
        },
      },
      {
        path: 'blog',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: {
          label: 'Blog',
          keyboardShortcut: 'B',
          isVisible: false,
        },
      },
      {
        path: 'export',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: {
          label: 'Export',
          keyboardShortcut: 'E',
          isVisible: false,
        },
      }
    ]
  },
];
