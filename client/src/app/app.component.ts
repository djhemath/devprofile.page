import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EnvironmentService } from './services/environment.service';
import { GITHUB_OAUTH_BASE_URL, GITHUB_SCOPES_QUERY_PARAM } from './shared/constants';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers: [EnvironmentService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private environment: EnvironmentService,
  ) { }

  get githubOAuthURL() {
    return `${GITHUB_OAUTH_BASE_URL}?client_id=${this.environment.githubClientId}&${GITHUB_SCOPES_QUERY_PARAM}`;
  }

  get apiBaseUrl() {
    return this.environment.apiBaseUrl;
  }
}
