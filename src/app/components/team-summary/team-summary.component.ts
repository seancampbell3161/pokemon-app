import { NgFor, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Pokemon } from '../../models/pokeapi-models';
import { TeamModelService } from '../../services/team-model.service';

@Component({
  selector: 'app-team-summary',
  standalone: true,
  imports: [TitleCasePipe, NgFor, ],
  templateUrl: './team-summary.component.html',
  styleUrl: './team-summary.component.scss'
})
export class TeamSummaryComponent {
  team: Pokemon[] = [];
  typeCounts: { [type: string]: number } = {};

  constructor(private teamService: TeamModelService) {}

  ngOnInit(): void {
    this.teamService.getTeam().subscribe(team => {
      this.team = team;
      this.calculateTypeCoverage();
    });
  }

  calculateTypeCoverage(): void {
    this.typeCounts = {};
    this.team.forEach(pokemon => {
      pokemon.types.forEach(type => {
        this.typeCounts[type.slot] = (this.typeCounts[type.slot] || 0) + 1;
      });
    });
  }

  getTypes(): string[] {
    return Object.keys(this.typeCounts);
  }
}
