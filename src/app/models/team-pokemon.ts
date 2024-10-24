import { Type } from "./pokeapi-models";

export interface TeamPokemon {
    id: number,
    name: string;
    types: Type[];
    sprite: string;
}