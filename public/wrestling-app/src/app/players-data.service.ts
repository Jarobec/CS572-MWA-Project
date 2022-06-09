import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { PageModel } from './classes/page-model';
import { PlayerModel } from './classes/player-model';

@Injectable({
  providedIn: 'root',
})
export class PlayersDataService {
  private _url = environment.API_BASEURL + environment.API_TEAMS_ROUTE;

  constructor(private _http: HttpClient) {}

  public getAll(
    teamId: string,
    pageIndex: number,
    searchValue: string
  ): Observable<PageModel> {
    let params = new HttpParams().set('offset', pageIndex);

    if (searchValue.length !== 0) {
      params = params.append('search', searchValue);
    }

    return this._http.get<PageModel>(
      this._url + teamId + environment.API_PLAYERS_ROUTE,
      { params }
    );
  }

  public getOne(teamId: string, playerId: string): Observable<PlayerModel> {
    return this._http.get<PlayerModel>(
      this._url + teamId + environment.API_PLAYERS_ROUTE + playerId
    );
  }

  public addOne(teamId: string, player: PlayerModel): Observable<PlayerModel> {
    return this._http.post<PlayerModel>(
      this._url + teamId + environment.API_PLAYERS_ROUTE,
      player
    );
  }

  public fullUpdateOne(
    teamId: string,
    playerId: string,
    player: PlayerModel
  ): Observable<PlayerModel> {
    return this._http.put<PlayerModel>(
      this._url + teamId + environment.API_PLAYERS_ROUTE + playerId,
      player
    );
  }

  public deleteOne(teamId: string, playerId: string): Observable<void> {
    return this._http.delete<void>(
      this._url + teamId + environment.API_PLAYERS_ROUTE + playerId
    );
  }
}
