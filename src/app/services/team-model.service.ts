import { Injectable } from '@angular/core';
import { Pokemon } from '../models/pokeapi-models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamModelService {

  private team$: BehaviorSubject<Pokemon[]> = new BehaviorSubject<Pokemon[]>([]);

  constructor() { }

  getTeam(): Observable<Pokemon[]> {
    return this.team$.asObservable();
  }

  getTeamValue(): Pokemon[] {
    return this.team$.getValue();
  }

  addPokemon(pokemon: Pokemon) {
    if (this.team$.getValue().length >= 6) {
      return;
    }

    this.team$.next([...this.team$.getValue(), pokemon]);
  }

  removePokemon(index: number) {
    if (this.team$.getValue().length === 1) {
      this.team$.next([]);
    }
    
    this.team$.getValue().splice(index, 1);
    this.team$.next(this.team$.getValue());
  }

  clearTeam(): void {
    this.team$.next([]);
  }

  isPokemonInTeam(pokemonId: number): boolean {
    return this.team$.getValue().some(p => p.id === pokemonId);
  }
}
