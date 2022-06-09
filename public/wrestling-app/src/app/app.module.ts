import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';
import { TeamsComponent } from './teams/teams.component';
import { TeamComponent } from './team/team.component';
import { FlagComponent } from './flag/flag.component';
import { PagingComponent } from './paging/paging.component';
import { TeamAddEditComponent } from './team-add-edit/team-add-edit.component';
import { PlayerAddEditComponent } from './player-add-edit/player-add-edit.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    NavigationComponent,
    TeamsComponent,
    TeamComponent,
    FlagComponent,
    PagingComponent,
    TeamAddEditComponent,
    PlayerAddEditComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'teams',
        component: TeamsComponent,
      },
      {
        path: 'team/view/:teamId',
        component: TeamComponent,
      },
      {
        path: 'team/add',
        component: TeamAddEditComponent,
      },
      {
        path: 'team/edit/:teamId',
        component: TeamAddEditComponent,
      },
      {
        path: 'team/edit/:teamId/player/add',
        component: PlayerAddEditComponent,
      },
      {
        path: 'team/edit/:teamId/player/edit/:playerId',
        component: PlayerAddEditComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
