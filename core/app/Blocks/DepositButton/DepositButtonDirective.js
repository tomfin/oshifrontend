CasinoDirectives
    .directive ('casinoDepositButton', [ function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: function(elem, attr){
            var type = attr.type || 'deposit';
            return '/app/Blocks/DepositButton/_' + type + '_button.html';
        },
        controller: ['$scope', '$rootScope', '$state', 'Auth', 'Player', function ($scope, $rootScope, $state, Auth, Player) {
            var widgetAuthTop = {},
                balance = {};

            $scope.accessLevels = Auth.accessLevels;
            $scope.widgetAuthTop = widgetAuthTop;
            $scope.balance = balance;
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
                        balance.currency = Auth.user.data.currency;
                    });
                }
            };
            $scope.$watch('user.data', function () {
                setUserBalance();
            });

            $rootScope.$watch('Info.currencies', function () {
                setUserBalance();
            });
        }]
    };
}]);
