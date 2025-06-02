import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-console',
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './console.component.html',
  styleUrl: './console.component.scss'
})
export class ConsoleComponent {
  title = '';

  onRouteChange(paths: string[]) {
    const joinedPaths = paths
                  .map(path => path.charAt(0).toLocaleUpperCase() + path.substring(1, path.length))
                  .join('.');

    this.title = `[${joinedPaths}]`;
  }
}
