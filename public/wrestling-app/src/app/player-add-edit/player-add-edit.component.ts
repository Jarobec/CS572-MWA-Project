import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PlayerModel } from '../classes/player-model';

import { PlayersDataService } from '../players-data.service';

@Component({
  selector: 'app-player-add-edit',
  templateUrl: './player-add-edit.component.html',
  styleUrls: ['./player-add-edit.component.css'],
})
export class PlayerAddEditComponent implements OnInit {
  headerLabel: string = environment.PLAYER_FORM_HEADER_ADD_LABEL;
  buttonLabel: string = environment.PLAYER_FORM_BUTTON_ADD_LABEL;
  playerForm!: FormGroup;
  #teamId!: string;
  #playerId!: string;

  constructor(
    private _activeRouter: ActivatedRoute,
    private _router: Router,
    private _playersService: PlayersDataService,
    private _formBuilder: FormBuilder
  ) {
    this.#teamId = _activeRouter.snapshot.params['teamId'] || '0';
    this.#playerId = _activeRouter.snapshot.params['playerId'] || '0';
  }

  ngOnInit(): void {
    this._createPlayerForm();
    if (this.#playerId === '0') {
    } else {
      this.headerLabel = environment.PLAYER_FORM_HEADER_EDIT_LABEL;
      this.buttonLabel = environment.PLAYER_FORM_BUTTON_EDIT_LABEL;
      this._getPlayer();
    }
  }

  _createPlayerForm(player?: PlayerModel) {
    const formBody = {
      name: [player?.name || ''],
      age: [player?.age || ''],
    };

    this.playerForm = this._formBuilder.group(formBody);
  }

  _getPlayer(): void {
    this._playersService
      .getOne(this.#teamId, this.#playerId)
      .subscribe((player) => this._createPlayerForm(player));
  }

  onSave(): void {
    if (this.#playerId === '0') {
      this._createPlayer();
    } else {
      this._updatePlayer();
    }
  }

  _createPlayer(): void {
    this._playersService
      .addOne(this.#teamId, this.playerForm.value)
      .subscribe((player) => this._redirect());
  }

  _updatePlayer(): void {
    this._playersService
      .fullUpdateOne(this.#teamId, this.#playerId, this.playerForm.value)
      .subscribe((player) => this._redirect());
  }

  _redirect(): void {
    this._router.navigate(['team/view/' + this.#teamId]);
  }
}
