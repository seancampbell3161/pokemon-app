import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Pokemon } from '../../models/pokeapi-models';
import { FormBuilder, FormControl, FormsModule } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { PokeapiService } from '../../services/pokeapi.service';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { NgIf, TitleCasePipe } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-pokemon-search',
  standalone: true,
  imports: [NgIf, AutoCompleteModule, FormsModule, ProgressSpinnerModule, TitleCasePipe],
  providers: [PokeapiService],
  templateUrl: './pokemon-search.component.html',
  styleUrl: './pokemon-search.component.scss'
})
export class PokemonSearchComponent {
  @Output() pokemonSelected = new EventEmitter<Pokemon>();
  
  searchControl: FormControl;
  filteredPokemons: Pokemon[] = [];
  isLoading = false;

  constructor(private fb: FormBuilder, private pokeapiService: PokeapiService) {
    this.searchControl = this.fb.control('');
  }

  onSearch(event: any): void {
    const query = event.query;
    if (!query) {
      this.filteredPokemons = [];
      return;
    }

    this.isLoading = true;
    this.pokeapiService.searchPokemon(query).pipe(
      catchError(() => of([])),
      tap(() => this.isLoading = false)
    ).subscribe(pokemon => {
      this.filteredPokemons = pokemon;
    });
  }

  onSelect(event: any): void {
    this.pokemonSelected.emit(event.value);
    this.searchControl.reset();
  }
}
