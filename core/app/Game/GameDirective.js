CasinoDirectives
    .directive ('casinoGame', ['$compile', '$parse', function ($compile, $parse) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: '/app/Game/_game_modal.html',
        link: function(scope, element, attr) {

        },
        controller: ['$scope', 'Game', '$location', '$window', '$timeout', '$rootScope', 'FavoriteList', 'Auth', '$state','GameActions', '$document', 'SYSTEM',  function ($scope, Game, $location, $window, $timeout, $rootScope, FavoriteList, Auth, $state, GameActions, $document, SYSTEM) {
            $scope.favorites = FavoriteList;
            $scope.accessLevels = Auth.accessLevels;
            $scope.GameActions = GameActions;


            angular.element($window).bind('resize', function (){
                GameActions.gameBoxResize();
            });
            $scope.$on('preloadHide', function (){
                GameActions.gameBoxResize();
            });
            $scope.$watch('isHd',function (newValue, oldValue){
                if (newValue !== undefined && oldValue != newValue) {
                    GameActions.gameBoxResize(newValue);
                }
            });

            $scope.game_url = false;

            var checkHash = function () {
                $scope.game_url = false;
                if ($window.location.hash) {
                    var hash = $window.location.hash.replace(/%2F/g, '/'),
                        regexp = new RegExp("#game-(.*-.*)-([0-9]*)", "i"),
                        matches = regexp.exec(hash);

                    if (matches == null) {
                        regexp = new RegExp("#game-(.*-.*)", "i");
                        matches = regexp.exec(hash);
                    }

                    if (matches != null && matches.length > 1) {
                        $('body').addClass('page-game');

                        $rootScope.$broadcast("preloadShow");
                        Game.showGame($scope, matches[1], matches[2]);

                        $timeout(GameActions.gameBoxResize, 0);
                    }

                }
            };

            $rootScope.close_game = $scope.close = function (noRedirectHome) {
                if ($scope.game_url) {
                    $location.hash('');
                    $scope.game_url = false;
                } else if (!noRedirectHome){
                    var redirect_state = SYSTEM.AFTER_LOGIN_REDIRECT || "home";
                    $state.go(redirect_state);
                }
                $('body').removeClass('page-game');
                $rootScope.page.game_title = false;
                $scope.game_url = false;
            };

            $scope.$on('$locationChangeSuccess', function(event) {
                var hash = $window.location.hash.replace(/%2F/g, '/');
                if (hash == '' || hash == '#%20') {
                    $('body').removeClass('page-game');
                    $rootScope.page.game_title = false;
                }

                checkHash();
            });
            $rootScope.$watch(function () {return $location.hash()}, function (newLocation, oldLocation) {
                var hash = $window.location.hash.replace(/%2F/g, '/');
                if (hash == '' || hash == '#%20') {
                    $('body').removeClass('page-game');
                    $rootScope.page.game_title = false;
                    $scope.game_url = false;
                }
            });

            checkHash();

        }]
    };
}]);
