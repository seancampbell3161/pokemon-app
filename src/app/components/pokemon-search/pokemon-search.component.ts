import { Component, output } from '@angular/core';
import { Pokemon } from '../../models/pokeapi-models';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { PokeapiService } from '../../services/pokeapi.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { NgIf, TitleCasePipe } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-pokemon-search',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, AutoCompleteModule, FormsModule, ProgressSpinnerModule, TitleCasePipe],
  providers: [PokeapiService],
  templateUrl: './pokemon-search.component.html',
  styleUrl: './pokemon-search.component.scss'
})
export class PokemonSearchComponent {
  pokemonSelected = output<Pokemon>();
  
  searchForm: FormGroup
  filteredPokemons: Pokemon[] = [];
  isLoading = false;

  constructor(private fb: FormBuilder, private pokeapiService: PokeapiService) {
    this.searchForm = this.fb.group({
      search: new FormControl('')
    })

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

    this.searchForm.get('search')?.reset();
  }
}
