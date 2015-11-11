CasinoDirectives
    .directive ('casinoGameSelector', [function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: '/app/Games/GameSelector/_game_selector.html',
        controller: ['$scope', '$rootScope', 'GamesData', '$window', function ($scope, $rootScope, GamesData, $window) {
            $scope.game = {};
            var checkHash = function () {
                if ($window.location.hash && $window.location.hash!='#!') {
                    var hash = $window.location.hash.replace(/%2F/g, '/'),
                        regexp = new RegExp("#game-(.*-.*)-([0-9]*)", "i"),
                        matches = regexp.exec(hash);

                    if (matches == null) {
                        regexp = new RegExp("#game-(.*-.*)", "i");
                        matches = regexp.exec(hash);
                    }
                    if (matches[1]) {
                        $scope.game = GamesData.getByIdentifier(matches[1].replace('-', '/'));
                    }
                    if (matches[2]) {
                        for (var key in $scope.game.currencies) {
                            if($scope.game.currencies[key].id == matches[2]) {
                                $scope.current_game_currency = $scope.game.currencies[key].currency;
                            }
                        }
                    }
                }
            };

            $rootScope.$watch('page.game_title', function () {
                $scope.current_game_currency = false;
                $scope.game = false;
                if ($rootScope.page.game_title) {
                    checkHash();
                }
            });

            $rootScope.$watch('data.games.data.providers', function () {
                if (Object.keys($rootScope.data.games.data.providers).length) {
                    checkHash();
                }
            });

        }]
    };
}]);
