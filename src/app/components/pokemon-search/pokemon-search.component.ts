import { Component, Signal, computed, output, signal } from '@angular/core';
import { Pokemon } from '../../models/pokeapi-models';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, catchError, finalize, of, switchMap, tap } from 'rxjs';
import { PokeapiService } from '../../services/pokeapi.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { NgIf, TitleCasePipe } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  isLoading = false;

  private resultsState = signal<Pokemon[] | null>(null);

  pokemonResults: Signal<Pokemon[]> = computed(() => this.resultsState() ?? []);

  searchPokemon$ = new Subject<string>();

  constructor(private fb: FormBuilder, private pokeapiService: PokeapiService) {
    this.searchForm = this.fb.group({
      search: new FormControl('')
    });

    this.searchPokemon$.pipe(
      takeUntilDestroyed(),
      switchMap((query) => this.pokeapiService.searchPokemon(query)),
      catchError(() => of([])),
      tap(() => this.isLoading = false),
    ).subscribe((res) => 
      this.resultsState.set(res)
    );
  }

  onSearch(event: any): void {
    const query = event.query;
    if (!query) {
      return;
    }

    this.isLoading = true;
    this.searchPokemon$.next(query);
  }

  onSelect(event: any): void {
    this.pokemonSelected.emit(event.value);

    this.searchForm.get('search')?.reset();
  }
}
