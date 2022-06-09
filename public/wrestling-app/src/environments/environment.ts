// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_BASEURL: 'The base URL which is connected to API.',
  API_TEAMS_ROUTE: 'The URL which is connect to Teams API',
  API_PLAYERS_ROUTE: 'The URL which is connect to Players API',

  TEAM_FORM_HEADER_ADD_LABEL:
    'Header label which is shown in the team adding form',
  TEAM_FORM_HEADER_EDIT_LABEL:
    'Header label which is shown in the team editing form',
  TEAM_FORM_BUTTON_ADD_LABEL: 'Button label which is create a new team',
  TEAM_FORM_BUTTON_EDIT_LABEL: 'Button label which is update a team',
  TEAM_NOT_FOUND_MESSAGE: 'Show message when the list of teams is empty',
  TEAM_SEARCH_BY: 'Placeholder value of team search input',

  PLAYER_FORM_HEADER_ADD_LABEL:
    'Header label which is shown in the player adding form',
  PLAYER_FORM_HEADER_EDIT_LABEL:
    'Header label which is shown in the player editing form',
  PLAYER_FORM_BUTTON_ADD_LABEL: 'Button label which is create a new player',
  PLAYER_FORM_BUTTON_EDIT_LABEL: 'Button label which is update a player',
  PLAYER_NOT_FOUND_MESSAGE: 'Show message when the list of players is empty',
  PLAYER_SEARCH_BY: 'Placeholder value of player search input',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
