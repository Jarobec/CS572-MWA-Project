import { PlayerModel } from './player-model';

export class TeamModel {
  #_id!: string;
  #name!: string;
  #country!: string;
  #numOfPartInOlympic!: number;
  #players!: PlayerModel[];

  constructor(id: string, name: string) {
    this.#_id = id;
    this.#name = name;
  }

  get _id(): string {
    return this.#_id;
  }
  get name(): string {
    return this.#name;
  }
  set name(name: string) {
    this.#name = name;
  }
  get country(): string {
    return this.#country;
  }
  set country(country: string) {
    this.#country = country;
  }
  get numOfPartInOlympic(): number {
    return this.#numOfPartInOlympic;
  }
  set numOfPartInOlympic(numOfPartInOlympic: number) {
    this.#numOfPartInOlympic = numOfPartInOlympic;
  }
  get players(): PlayerModel[] {
    return this.#players;
  }
  set players(players: PlayerModel[]) {
    this.#players = players;
  }
}
