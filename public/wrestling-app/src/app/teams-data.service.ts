import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { PageModel } from './classes/page-model';
import { TeamModel } from './classes/team-model';

@Injectable({
  providedIn: 'root',
})
export class TeamsDataService {
  private _url = environment.API_BASEURL + environment.API_TEAMS_ROUTE;

  constructor(private _http: HttpClient) {}

  public getAll(pageIndex: number, searchValue: string): Observable<PageModel> {
    let params = new HttpParams().set('offset', pageIndex);

    if (searchValue.length !== 0) {
      params = params.append('search', searchValue);
    }

    return this._http.get<PageModel>(this._url, { params });
  }

  public getOne(teamId: string): Observable<TeamModel> {
    return this._http.get<TeamModel>(this._url + teamId);
  }

  public addOne(team: TeamModel): Observable<TeamModel> {
    return this._http.post<TeamModel>(this._url, team);
  }

  public fullUpdateOne(teamId: string, team: TeamModel): Observable<TeamModel> {
    return this._http.put<TeamModel>(this._url + teamId, team);
  }

  public deleteOne(teamId: string): Observable<void> {
    return this._http.delete<void>(this._url + teamId);
  }
}
