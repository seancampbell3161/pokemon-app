import { Component } from '@angular/core';
import { TeamModelService } from '../../services/team-model.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  teamCount: number = 0;

  constructor(private teamService: TeamModelService) {}

  ngOnInit(): void {
    this.teamService.getTeam().subscribe(team => {
      this.teamCount = team.length;
    });
  }

  clearTeam(): void {
    this.teamService.clearTeam();
  }
}
