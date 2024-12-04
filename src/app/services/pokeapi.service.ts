import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { Pokemon } from '../models/pokeapi-models';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {

  private cache: Map<string, any> = new Map<string, Pokemon>();
  private apiUrl: string = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  searchPokemon(query: string): Observable<Pokemon[]> {
    if (this.cache.has(query)) {
      return of(this.cache.get(query));
    }

    return this.http.get<any>(`${this.apiUrl}/pokemon?limit=10000`).pipe(
      map(response => response.results),
      map((allPokemons: any[]) => {
        const matchedPokemons = allPokemons.filter(pokemon => pokemon.name.startsWith(query));
        // limit to first 10 results
        return matchedPokemons.slice(0, 10);
      }),
      switchMap((pokemonRes: any[]) => {
        // fetch detailed data for each matched Pokemon
        const requests = pokemonRes.map(pokemon => this.getPokemonByName(pokemon.name));
        return forkJoin([...requests]);
      }),
      tap(pokemons => this.cache.set(query, pokemons)),
      catchError(() => of([]))
    );
  }

  getPokemonByName(name: string): Observable<Pokemon> {
    const key = `name-${name}`;
    if (this.cache.has(key)) {
      return of(this.cache.get(key));
    } else {
      const url = `${this.apiUrl}/pokemon/${name}`;
      return this.http.get<Pokemon>(url).pipe(
        tap(pokemon => this.cache.set(key, pokemon))
      );
    }
  }

  getPokemonById(pokemonId: number): Observable<Pokemon> {
    if (this.cache.has(pokemonId.toString())) {
      return of(this.cache.get(pokemonId.toString()));
    }

    return this.http.get<Pokemon>(`${this.apiUrl}/${pokemonId}`).pipe(
      tap(data => this.cache.set(pokemonId.toString(), data))
    );
  }
}
