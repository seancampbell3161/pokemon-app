import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, effect, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TeamService } from '../../services/team.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { Pokemon } from '../../models/pokeapi-models';
import { PokemonSearchComponent } from '../pokemon-search/pokemon-search.component';
import { TeamPokemon } from '../../models/team-pokemon';

@Component({
  selector: 'app-team-builder',
  standalone: true,
  imports: [ NgIf, NgFor, PokemonCardComponent, PokemonSearchComponent, ReactiveFormsModule],
  templateUrl: './team-builder.component.html',
  styleUrl: './team-builder.component.scss'
})
export class TeamBuilderComponent implements OnInit {
  public teamService = inject(TeamService);
  private fb = inject(FormBuilder);

  team: Pokemon[] = this.teamService.team();
  teamForm!: FormGroup;
  maxTeamSize: number = 6;

  constructor() {
    effect(() => this.updateFormArray(this.teamService.team()))
  }

  get pokemon(): FormArray {
    return this.teamForm?.get('pokemon') as FormArray;
  }

  ngOnInit(): void {
    this.initForm();
  }

  addPokemonToForm(pokemon: Pokemon): void {
    const pokemonGroup = this.fb.group({
      id: [pokemon.id, Validators.required],
      name: [pokemon.name, Validators.required],
      types: [pokemon.types, Validators.required],
      sprite: [pokemon.sprites.front_default, Validators.required]
    });
    this.pokemon.push(pokemonGroup);
  }

  submitTeam(): void {
    if (this.teamForm.valid) {
      const teamPokemon: TeamPokemon[] = this.pokemon.value;
      window.alert(`Team Submitted: ${teamPokemon.map(p => p.name).join(', ')}`);
    } else {
      this.teamForm.markAllAsTouched();
    } 
  }

  private initForm(): void {
    this.teamForm = this.fb.group({
      pokemon: this.fb.array([], [Validators.maxLength(this.maxTeamSize), this.noDuplicatePokemon()])
    });
  }

  private updateFormArray(team: Pokemon[]): void {
    while (this.pokemon && this.pokemon?.length !== 0) {
      this.pokemon.removeAt(0);
    }

    team.forEach(pokemon => {
      this.addPokemonToForm(pokemon);
    });
  }

  private noDuplicatePokemon(): ValidatorFn {
    return (arr: AbstractControl): ValidationErrors | null => {
        const formArray = arr as FormArray;
        const selectedIds = formArray.controls.map(control => control.value.id);
        const duplicateIds = selectedIds.filter((item, index) => selectedIds.indexOf(item) !== index);
        return duplicateIds.length ? { duplicatePokemon: true } : null;     
    }
  }
}
