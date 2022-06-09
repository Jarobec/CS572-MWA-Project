import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { TeamModel } from '../classes/team-model';
import { TeamsDataService } from '../teams-data.service';

@Component({
  selector: 'app-team-add-edit',
  templateUrl: './team-add-edit.component.html',
  styleUrls: ['./team-add-edit.component.css'],
})
export class TeamAddEditComponent implements OnInit {
  headerLabel: string = environment.TEAM_FORM_HEADER_ADD_LABEL;
  buttonLabel: string = environment.TEAM_FORM_BUTTON_ADD_LABEL;
  teamForm!: FormGroup;
  #teamId!: string;

  constructor(
    private _activeRouter: ActivatedRoute,
    private _router: Router,
    private _teamsService: TeamsDataService,
    private _formBuilder: FormBuilder
  ) {
    this.#teamId = _activeRouter.snapshot.params['teamId'] || '0';
  }

  ngOnInit(): void {
    this._createTeamForm();
    if (this.#teamId === '0') {
    } else {
      this.headerLabel = environment.TEAM_FORM_HEADER_EDIT_LABEL;
      this.buttonLabel = environment.TEAM_FORM_BUTTON_EDIT_LABEL;
      this._getTeam();
    }
  }

  _createTeamForm(team?: TeamModel) {
    const formBody = {
      name: [team?.name || ''],
      country: [team?.country || ''],
      numOfPartInOlympic: [team?.numOfPartInOlympic || ''],
    };

    this.teamForm = this._formBuilder.group(formBody);
  }

  _getTeam(): void {
    this._teamsService
      .getOne(this.#teamId)
      .subscribe((team) => this._createTeamForm(team));
  }

  onSave(): void {
    if (this.#teamId === '0') {
      this._createTeam();
    } else {
      this._updateTeam();
    }
  }

  _createTeam(): void {
    this._teamsService
      .addOne(this.teamForm.value)
      .subscribe((team) => this._redirect());
  }

  _updateTeam(): void {
    this._teamsService
      .fullUpdateOne(this.#teamId, this.teamForm.value)
      .subscribe((team) => this._redirect());
  }

  _redirect(): void {
    if (this.#teamId === '0') {
      this._router.navigate(['teams']);
    } else {
      this._router.navigate(['team/view/' + this.#teamId]);
    }
  }
}
