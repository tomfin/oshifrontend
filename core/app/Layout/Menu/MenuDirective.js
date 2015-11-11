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
        controller: ['$scope', 'Pages', 'Auth', '$rootScope', '$state', 'Info', function ($scope, Pages, Auth, $rootScope, $state, Info) {
            var menu = [],
                states = $state.get();

            $scope.accessLevels = Auth.accessLevels;
            $scope.state = $state;
            $scope.menu = menu;
            $scope.currentLocale = $rootScope.currentLocale;
            $scope.root = $rootScope;

            $scope.get_sref = function (method) {
                var sref = 'app.external({id:\'' + method + '\', lang:\'' + $rootScope.currentLocale + '\'})';

                for (var key in states) {
                    if (states[key] && states[key].name != '' && states[key].name == 'app.' + method) {
                        sref = 'app.' + method + '({lang:\'' + $rootScope.currentLocale + '\'})';
                        break;
                    }
                }
                sref = sref.replace('/', '\/');
                return sref;
            };

            var load_menu = function () {
                //FROM URL
                Pages.list({l: $rootScope.currentLocale}, function(data){

                    var menu = [];
                    for (var i = 0, length = data.length; i < length; i++) {
                        if (data[i].categories.indexOf($scope.type) != -1) {
                            menu.push(data[i]);
                        }
                        if (data[i].children && data[i].children.length) {
                            for (var j = 0, child_length = data[i].children.length; j < child_length; j++) {
                                if (data[i].children[j].categories.indexOf($scope.type) != -1) {
                                    menu.push(data[i].children[j]);
                                }
                            }
                        }
                    }


                    $scope.menu = menu;
                });
            };

            $rootScope.$watch('currentLocale', function (newValue, oldValue) {
                if ($rootScope.currentLocale && newValue != oldValue) {
                    $scope.currentLocale = $rootScope.currentLocale;
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
