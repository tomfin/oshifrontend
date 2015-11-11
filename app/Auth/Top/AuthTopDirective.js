CasinoDirectives
    .directive ('casinoAuthTop', [ function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: function(elem, attr){
            var type = attr.type || 'authTop';
            return '/app/Auth/Top/_' + type + '.html';
        },
        controller: ['$scope', '$rootScope', '$state', 'Auth', 'Info', 'Player', function ($scope, $rootScope, $state, Auth, Info, Player) {
            var widgetAuthTop = {},
                balance = {};

            $scope.accessLevels = Auth.accessLevels;
            $scope.data = $rootScope.data;
            $scope.widgetAuthTop = widgetAuthTop;
            $scope.balance = balance;
            $scope.currentLocale = $rootScope.currentLocale;

            widgetAuthTop.logout = function () {
                Auth.logout();
            };

            $scope.user = Auth.user;

            var setUserBalance = function () {
                if (!Auth.authorize(Auth.accessLevels.anon)) {
                    Player.balance(function(data){
                        for (var key in data) {
                            if (Auth.user.data.currency == data[key].currency && $rootScope.Info.currencies) {
                                for (var c_key in $rootScope.Info.currencies) {
                                    if ($rootScope.Info.currencies[c_key].code == data[key].currency) {
                                        balance.value = data[key].amount_cents / $rootScope.Info.currencies[c_key].subunits_to_unit;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        balance.currency = $scope.data.user.currency;

                        Info.profile_routes(function (data) {
                            $scope.profile_routes = data;
                        })
                    });
                }
            };
            $rootScope.$watch('data.user.currency', function (newValue, oldValue) {
                if ($rootScope.currentLocale && newValue != oldValue) {
                    balance.currency = $scope.data.user.currency;
                }
            });
            $scope.$watch('user.data', function () {
                setUserBalance();
            });

            $rootScope.$watch('Info.currencies', function () {
                setUserBalance();
            });

            $rootScope.$watch('currentLocale', function (newValue, oldValue) {
                if ($rootScope.currentLocale && newValue != oldValue) {
                    $scope.currentLocale = $rootScope.currentLocale;
                }
            });
        }]
    };
}]);
