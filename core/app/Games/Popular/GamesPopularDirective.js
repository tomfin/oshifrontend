CasinoDirectives
    .directive ('casinoGamesPopular', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: '/app/Games/Popular/_popular.html',
            controller: 'GamesList'
        };
    }]);
