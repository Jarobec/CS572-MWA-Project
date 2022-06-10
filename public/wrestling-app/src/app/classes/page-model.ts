import { PlayerModel } from './player-model';
import { TeamModel } from './team-model';

export class PageModel {
  #data!: [];
  #totalPage!: number;

  constructor(totalPage: number) {
    this.#totalPage = totalPage;
  }

  get data(): [] {
    return this.#data;
  }

  get totalPage(): number {
    return this.#totalPage;
  }
}
