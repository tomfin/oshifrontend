CasinoDirectives
    .directive ('casinoGamesFillingLucky', ["$stateParams", '$filter', function ($stateParams, $filter) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            category: "@category",
            provider: "@provider"
        },
        templateUrl: '/app/Games/FillingLucky/_filling_lucky.html',
        controller: ['$scope', 'GamesList', function ($scope, GamesList) {
            var md = new MobileDetect(window.navigator.userAgent);

            $scope.games = [];
            $scope.collection = $stateParams.category || $scope.category || 'all';
            $scope.currency = false;
            $scope.provider = $scope.provider || false;
            $scope.device = md.mobile() ? 'mobile' : 'desktop';

            GamesList.make($scope);
            GamesList.collections($scope);

            $scope.play = function (redirect) {
                if (redirect == undefined) {
                    redirect = true;
                }

                var game = false,
                    games = $scope.games;

                games = $filter('gameDevice')($scope.games, $scope.device);
                if ($scope.provider != 'false') {
                    games = $filter('gameProvider')(games, $scope.provider);
                }
                games = $filter('gameCurrency')(games, $scope.currency);
                games = $filter('gameCollections')(games, $scope.collection);

                game = games[Math.floor(Math.random() * games.length)];

                if (redirect) {
                    window.location.href = game.play_url;
                }
                return game;
            }
        }]
    };
}]);