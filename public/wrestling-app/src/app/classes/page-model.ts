import { PlayerModel } from './player-model';
import { TeamModel } from './team-model';

export class PageModel {
  #teams!: TeamModel[];
  #players!: PlayerModel[];
  #totalPage!: number;

  constructor(totalPage: number) {
    this.#totalPage = totalPage;
  }

  get teams(): TeamModel[] {
    return this.#teams;
  }

  get players(): PlayerModel[] {
    return this.#players;
  }

  get totalPage(): number {
    return this.#totalPage;
  }
}
