CasinoServices
    .factory('Game', ['GamesList', 'LastPlayedList', '$sce', '$window', '$timeout', '$rootScope', '$state', function (GamesList, LastPlayedList, $sce, $window, $timeout, $rootScope, $state) {

        return {
            showGame: function ($scope, identifier, id) {
                var game_id = id;

                GamesList.getGameList(true)
                    .then(
                    function(games) {
                        if (identifier) {
                            identifier = identifier.replace('-', '/');
                        }
                        for (var i = 0, games_length = games.length; i < games_length; i++) {
                            if (id && games[i].id == id) {
                                $scope.game_url = $sce.trustAsResourceUrl(games[i].play_url);
                                break;
                            }
                            if (id && games[i].demo_id == id) {
                                $scope.game_url = $sce.trustAsResourceUrl(games[i].play_url_fun);
                                break;
                            }
                            if (!id && identifier && identifier == games[i].identifier) {
                                game_id = games[i].id;
                                $scope.game_url = $sce.trustAsResourceUrl(games[i].play_url);
                                break;
                            }
                        }

                        if(game_id && $scope.game_url) {
                            if ($state.current.name != 'game') {
                                $('body').addClass('page-game');
                            }
                            $rootScope.page.game_title = games[i].title;

                            LastPlayedList.add(game_id);
                        }
                        $scope.game = games[i];
                        $timeout(function (){
                            $($window).resize();
                            $rootScope.$broadcast("preloadHide");
                        }, 0);
                    }
                );
            }
        }

    }]);
