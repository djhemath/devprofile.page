import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, Routes } from '@angular/router';
import { routes } from '../../pages/console/console.route';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  public menuItems: Routes = routes[0].children!.filter(route => route.data && route.data['isVisible']);
  public selectedRoute: string[] = [];

  @Output() routeChanged = new EventEmitter<string[]>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentDeepRoute = this.getCurrentChildRoute(this.route);
      this.selectedRoute = currentDeepRoute.map(route => route.snapshot.url[0].path);
      this.routeChanged.emit(this.selectedRoute);
    });
  }

  getCurrentChildRoute(route: ActivatedRoute): ActivatedRoute[] {
    const paths = [];
    while (route.firstChild) {
      route = route.firstChild;
      paths.push(route);
    }

    return paths;
  }
}
