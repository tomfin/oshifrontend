CasinoDirectives
    .directive ('casinoLatestWinners', [ function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            channels: '=channels',
            type: '@type'
        },
        templateUrl: function(elem, attr){
            var type = attr.type || 'latestWinners';
            return '/app/Winners/Latest/_' + type + '.html';
        },
        controller: ['$scope', '$rootScope', 'Winners', 'GamesList', 'Games', 'SYSTEM', 'Auth', '$q', function ($scope, $rootScope, Winners, GamesList, Games, SYSTEM, Auth, $q) {
            $scope.accessLevels = Auth.accessLevels;
            $scope.data = $rootScope.data;

            $q.all({
                games: Games.list({l: $rootScope.currentLocale}).$promise,
                games_winners: Winners.latest().$promise,
                demo: Games.demo({l: $rootScope.currentLocale}).$promise
            }).then(function (result) {

                var games_demo = result.demo,
                    games_list = result.games,
                    top_winners = result.games_winners,
                    result_top_winners = [];

                top_winners.forEach(function (top_winners_game){
                    var idArr = games_list.filter(function (game_list){
                        return game_list.identifier == top_winners_game.game_identifier && game_list.currency == top_winners_game.currency
                    });
                    var demo_idArr = games_demo.filter(function (game_demo){
                        return game_demo.identifier == top_winners_game.game_identifier
                    });
                    if (idArr.length && demo_idArr.length) {
                        top_winners_game.id = idArr[0].id;
                        top_winners_game.demo_id = demo_idArr[0].id;
                        top_winners_game.identifier = top_winners_game.game_identifier;
                        result_top_winners.push(top_winners_game);
                    }
                });
                $scope.games_winners = result_top_winners;
            });

            var client = new Faye.Client(SYSTEM.URL_PS);
            client.subscribe($scope.channels, function (game) {

                if (game.bet_amount_cents < game.win_amount_cents) {
                    $scope.$apply(function () {
                        var idArr = games_list.filter(function (game_list){
                            return game_list.identifier == game.game_identifier && game_list.currency == game.currency
                        });
                        var demo_idArr = games_demo.filter(function (game_demo){
                            return game_demo.identifier == game.game_identifier
                        });
                        if (idArr.length && demo_idArr.length) {
                            game.id = idArr[0].id;
                            game.demo_id = demo_idArr[0].id;
                            game.identifier = game.game_identifier;
                            $scope.games_winners.unshift(game);
                        }
                    });
                }
            });


        }]
    };
}]);
