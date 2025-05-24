import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, catchError, of } from 'rxjs';
import { EnvironmentService } from '../services/environment.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private http: HttpClient,
    private router: Router,
    private environment: EnvironmentService,
  ) {}

  async canActivate(): Promise<boolean> {
    try {
      const session = await firstValueFrom(
        this.http.get<{ user: any }>(`${this.environment.apiBaseUrl}/api/session`, { withCredentials: true }).pipe(
          catchError(() => of(null))
        )
      );

      if (!session || !session.user) {
        this.router.navigate(['/auth']);
        return false;
      }

      return true;
    } catch (err) {
      this.router.navigate(['/auth']);
      return false;
    }
  }
}