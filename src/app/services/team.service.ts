import { Injectable, computed, effect, signal } from '@angular/core';
import { Pokemon } from '../models/pokeapi-models';
import { Subject, debounceTime } from 'rxjs';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export interface PokemonTeamState {
  team: Pokemon[];
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private state = signal<PokemonTeamState>({ team: [] });

  team = computed(() => this.state().team);
  teamCount = computed(() => this.state().team.length)

  addPokemon$ = new Subject<Pokemon>();
  removePokemon$ = new Subject<number>();
  resetTeam$ = new Subject<null>();

  constructor() {
    this.addPokemon$.pipe(
      takeUntilDestroyed(),
      debounceTime(100),
      ).subscribe((pokemon) => 
        this.state.update((state) => ({
          ...state,
          team: [
            ...state.team,
            { ...pokemon, }
          ]
        }))
    );

    this.removePokemon$.pipe(takeUntilDestroyed()).subscribe((id) => {
      if (this.state().team.length < 2) { this.state.update((state) => ({ ...state, team: [] })); }
      else { 
        this.state.update((state) => ({
          ...state,
          team: state.team.filter(p => p.id !== id)
        })); 
      }
    });

    this.resetTeam$.pipe(takeUntilDestroyed()).subscribe(() => 
      this.state.update((state) => ({
        ...state,
        team: [],
      }))
    );
  }

  isPokemonInTeam(pokemonId: number): boolean {
    return this.state().team.some(p => p.id === pokemonId);
  }
}
