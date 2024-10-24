import { Routes } from '@angular/router';
import { TeamBuilderComponent } from './components/team-builder/team-builder.component';
import { TeamSummaryComponent } from './components/team-summary/team-summary.component';
import { PokemonSearchComponent } from './components/pokemon-search/pokemon-search.component';

export const routes: Routes = [
    {
        path: '',
        component: TeamBuilderComponent
    },
    {
        path: 'summary',
        component: TeamSummaryComponent
    },
    {
        path: 'search',
        component: PokemonSearchComponent
    },
    {
        path: '**',
        component: TeamBuilderComponent
    }
];
