export class PlayerModel {
  #_id!: string;
  #name!: string;
  #age!: number;

  constructor(id: string, name: string, age: number) {
    this.#_id = id;
    this.#name = name;
    this.#age = age;
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
  get age(): number {
    return this.#age;
  }
  set age(age: number) {
    this.#age = age;
  }
}
