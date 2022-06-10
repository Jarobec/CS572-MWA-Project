import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

import { TeamModel } from '../classes/team-model';
import { PlayersDataService } from '../players-data.service';
import { TeamsDataService } from '../teams-data.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
})
export class TeamComponent implements OnInit {
  notFoundMessage: string = environment.TEAM_NOT_FOUND_MESSAGE;
  searchBy: string = environment.PLAYER_SEARCH_BY;
  team!: TeamModel;
  #teamId!: string;
  pageIndex: number = 0;
  totalPage: number = 0;
  searchValue: string = '';

  constructor(
    private _router: ActivatedRoute,
    private _teamsService: TeamsDataService,
    private _playersService: PlayersDataService
  ) {
    this.team = new TeamModel('', '');
    this.#teamId = this._router.snapshot.params['teamId'] || '0';
  }

  ngOnInit(): void {
    this._teamsService.getOne(this.#teamId).subscribe((team) => {
      this.team = team;
      this._getPlayers();
    });
  }

  _getPlayers(): void {
    this._playersService
      .getAll(this.#teamId, this.pageIndex, this.searchValue)
      .subscribe((data) => {
        this.totalPage = data.totalPage;
        this.team.players = data.data;
      });
  }

  onPage(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this._getPlayers();
  }

  deletePlayer(playerId: string): void {
    this._playersService
      .deleteOne(this.#teamId, playerId)
      .subscribe(() => this._getPlayers());
  }

  onSearch(value: string) {
    this.searchValue = value;
    this._getPlayers();
  }
}
