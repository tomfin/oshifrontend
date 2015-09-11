CasinoDirectives
    .directive ('casinoGamesAutocomplete', [ function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            category: "@category",//default category
            limit_count: "@limit"
        },
        templateUrl: '/app/Games/GamesAutocomplete/_games_autocomplete.html',
        controller: 'GamesList'
    };
}]);