CasinoDirectives
    .directive ('casinoGamesAutocomplete', [ function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            name: '@name',
            default_filters: "=filters",
            limit_count: "@limit"
        },
        templateUrl: '/app/Games/GamesAutocomplete/_games_autocomplete.html',
        controller: 'GamesBlock'
    };
}]);
