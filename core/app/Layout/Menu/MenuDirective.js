CasinoDirectives
    .directive ('casinoMenu', [ function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            type: '@type'
        },
        templateUrl: function(elem, attr){
            return '/app/Layout/Menu/_' + attr.type + '.html';
        },
        controller: ['$scope', 'Pages', '$rootScope', '$state', 'Info', function ($scope, Pages, $rootScope, $state, Info) {
            var menu = [],
                states = $state.get();

            $scope.state = $state;
            $scope.menu = menu;
            $scope.root = $rootScope;

            $scope.get_sref = function (method) {
                var sref = 'external({id:\'' + method + '\'})';

                for (var key in states) {
                    if (states[key].name != '' && states[key].name == method) {
                        sref = method;
                        break;
                    }
                }
                return sref;
            };

            var load_menu = function () {
                Pages.list({l: $rootScope.currentLocale}, function(data){
                    var menu = [];
                    for (var i = 0, length = data.length; i < length; i++) {
                        if (data[i].categories.indexOf($scope.type) != -1) {
                            menu.push(data[i]);
                        }
                    }
                    $scope.menu = menu;
                });
            };

            $rootScope.$watch('currentLocale', function (newValue, oldValue) {
                if ($rootScope.currentLocale && newValue != oldValue) {
                    load_menu();
                }
            });

            if ($rootScope.currentLocale) {
                load_menu();
            }

            Info.profile_routes(function (data) {
                $scope.profile_routes = data;
            })

        }]
    };
}]);