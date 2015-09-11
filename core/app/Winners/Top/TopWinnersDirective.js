CasinoDirectives
    .directive ('casinoTopWinners', [ function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            type: '@type'
        },
        templateUrl: function(elem, attr){
            var type = attr.type || 'topWinners';
            return '/app/Winners/Top/_' + type + '.html';
        },
        controller: ['$scope', '$rootScope', 'Winners', 'GamesList', 'Games', 'Auth', '$q', function ($scope, $rootScope, Winners, GamesList, Games, Auth, $q) {
            $scope.accessLevels = Auth.accessLevels;
            $scope.data = $rootScope.data;

            $q.all({
                games: Games.list({l: $rootScope.currentLocale}).$promise,
                top_winners: Winners.top().$promise,
                demo: Games.demo({l: $rootScope.currentLocale}).$promise
            }).then(function (result) {

                var games_demo = result.demo,
                    games_list = result.games,
                    top_winners = result.top_winners,
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

        }]
    };
}]);
