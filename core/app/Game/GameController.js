CasinoControllers
    .controller('Game', ['$scope', '$rootScope', '$state', '$stateParams', 'Game', '$location', 'Auth',  function ($scope, $rootScope, $state, $stateParams, Game, $location, Auth) {
        var getGameData = function (game, is_demo) {
            is_demo = is_demo || $rootScope.demo_mode || false;
            var game_identifier = game.identifier.split('/'),
                game_id = is_demo ? game.demo_id : game.id;

            return {type: game_identifier[0], name: game_identifier[1], id: game_id};
        };

        var providersLocationURL = [
            'quickfire',
            'betsoftgaming'
        ];

        $scope.openGame = {
            page: function (game, is_demo) {
                if (providersLocationURL.indexOf(game.provider) > -1 && game.devices.indexOf('mobile') > -1) {
                    if (is_demo) {
                        window.location.href = game.play_url_fun;
                    } else {
                        window.location.href = game.play_url;
                    }
                } else {
                    $state.go('game', getGameData(game, is_demo));
                }
            },

            modal: function (game, is_demo) {
                var game_data = getGameData(game, is_demo),
                    path = '#game-' + game_data.type + '-' + game_data.name;
                if (game_data.id) {
                    path += '-' + game_data.id
                }

                path = $location.path() + path;

                return path;
            },
            showModal: function (game, is_demo) {
                var game_path = this.modal(game, is_demo);
                $location.hash(game_path.slice(game_path.indexOf('#') + 1));
            }
        };

        $scope.game_url = false;

        if ($stateParams && $stateParams.type && $stateParams.name) {
            $scope.user = Auth.user;
            $scope.$watch('user', function (newValue, oldValue) {
                if ($scope.user && newValue != oldValue) {
                    Game.showGame($scope, $stateParams.type + '/' + $stateParams.name, $stateParams.id);
                }
            }, true);
            Game.showGame($scope, $stateParams.type + '/' + $stateParams.name, $stateParams.id);
        }
    }]);
