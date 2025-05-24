import { Component } from '@angular/core';

import { GITHUB_OAUTH_BASE_URL, GITHUB_SCOPES_QUERY_PARAM } from '../../shared/constants';
import { EnvironmentService } from '../../services/environment.service';

@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  constructor(
    private environment: EnvironmentService,
  ) { }

  get githubOAuthURL() {
    return `${GITHUB_OAUTH_BASE_URL}?client_id=${this.environment.githubClientId}&${GITHUB_SCOPES_QUERY_PARAM}`;
  }
}
