CasinoDirectives
    .directive ('casinoGamesNew', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: '/app/Games/New/_new.html',
            controller: 'GamesList'
        };
    }])
