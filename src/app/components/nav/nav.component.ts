import { Component, inject } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  private teamService = inject(TeamService);

  teamCount: number = this.teamService.teamCount();

  clearTeam(): void {
    this.teamService.resetTeam$.next(null);
  }
}
