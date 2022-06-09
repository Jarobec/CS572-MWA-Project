import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

import { TeamModel } from '../classes/team-model';
import { TeamsDataService } from '../teams-data.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
})
export class TeamsComponent implements OnInit {
  searchBy: string = environment.TEAM_SEARCH_BY;
  teams: TeamModel[] = [];
  pageIndex: number = 0;
  totalPage: number = 0;
  searchValue: string = '';

  constructor(private _teamsService: TeamsDataService) {}

  ngOnInit(): void {
    this._getTeams();
  }

  _getTeams(): void {
    this._teamsService
      .getAll(this.pageIndex, this.searchValue)
      .subscribe((data) => {
        this.teams = data.teams;
        this.totalPage = data.totalPage;
      });
  }

  onPage(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this._getTeams();
  }

  onDelete(teamId: string): void {
    this._teamsService.deleteOne(teamId).subscribe(() => {
      this._getTeams();
    });
  }

  onSearch(value: string) {
    this.searchValue = value;
    this._getTeams();
  }
}
