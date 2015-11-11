CasinoServices
    .factory('Game', ['GamesData', 'LastPlayedList', '$sce', '$window', '$timeout', '$rootScope', '$state', 'Auth', function (GamesData, LastPlayedList, $sce, $window, $timeout, $rootScope, $state, Auth) {

        return {
            showGame: function ($scope, identifier, id) {
                if (identifier) {
                    identifier = identifier.replace('-', '/');
                }

                var getGame = function (identifier, id) {
                    var game = GamesData.getByIdentifier(identifier),
                        current_game = false;

                    if ($rootScope.data.user.currency && $rootScope.data.user.currency != 'FUN') {
                        for (var key in game.currencies) {
                            if (game.currencies[key].id == id) {
                                current_game = game.currencies[key];
                                break;
                            }
                        }
                    } else if (game.currencies) {
                        current_game = game.currencies['FUN'];
                    }

                    if (!current_game) {
                        current_game = game = GamesData.data.games.restricted[id];
                        if (!$rootScope.data.games.inited) {
                            return false;
                        }
                        if (!current_game) {
                            $state.go('404');
                            return false;
                        }
                    }

                    $scope.game_url = $sce.trustAsResourceUrl(current_game.play_url);

                    if(id && $scope.game_url) {
                        if ($state.current.name != 'game') {
                            $('body').addClass('page-game');
                        }

                        $rootScope.data.user.currency = current_game.currency;
                        $rootScope.page.game_title = game.title;

                        LastPlayedList.add(identifier);
                    }
                    $scope.game = game;
                    $timeout(function (){
                        $scope.show_iframe = true;
                        $timeout(function (){
                            $($window).resize();
                            $rootScope.$broadcast("preloadHide");
                        }, 0);
                    }, 0);
                };


                $scope.show_iframe = false;


                Auth.check(function(data){
                    if ($rootScope.data.games.inited) {
                        getGame(identifier, id);
                    } else {
                        $rootScope.$watch('data.games.inited', function(a,b){
                            if ($rootScope.data.games.inited) {
                                getGame(identifier, id);
                            }
                        });
                    }
                    $rootScope.$watch('data.user.currency', function () {
                        if ($rootScope.data.user.currency == false || $rootScope.data.user.currency == 'FUN') {
                            if($scope.game_url) {
                                getGame(identifier, id);
                            }
                        }
                    })
                });


            }
        }

    }]);
