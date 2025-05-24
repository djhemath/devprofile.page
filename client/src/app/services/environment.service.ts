import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
    get production() { return environment.production }
    get apiBaseUrl() { return environment.apiBaseUrl }
    get githubClientId() { return environment.githubClientId }
}
