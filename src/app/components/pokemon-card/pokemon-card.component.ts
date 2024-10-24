import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgFor, TitleCasePipe } from '@angular/common';
import { TeamPokemon } from '../../models/team-pokemon';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [ TitleCasePipe, NgFor],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.scss'
})
export class PokemonCardComponent implements OnInit {
  @Input() pokemon: TeamPokemon | undefined;
  @Output() remove = new EventEmitter<void>();

  types: string | undefined = 'N/A';

  ngOnInit(): void {
    this.types = this.pokemon?.types.map(t => t.type.name).join(', ');
  }
}
