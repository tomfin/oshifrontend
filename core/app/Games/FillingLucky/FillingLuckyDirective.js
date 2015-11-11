CasinoDirectives
    .directive ('casinoGamesFillingLucky', ["$stateParams", '$filter', function ($stateParams, $filter) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            filter_name: '@filterName'
        },
        templateUrl: '/app/Games/FillingLucky/_filling_lucky.html',
        controller: ['$scope', 'GamesData', function ($scope, GamesData) {
            $scope.play = function (redirect) {
                if (redirect == undefined) {
                    redirect = true;
                }

                var game = false,
                    filters = GamesData.filters.get($scope.filter_name);

                game = filters.games[Math.floor(Math.random() * filters.games.length)];

                if (redirect) {
                    //TODO add url checker
                    window.location.href = game.play_url;
                }
                return game;
            }
        }]
    };
}]);
