CasinoDirectives
    .directive ('casinoLocalesSelector', ['FLAGS', 'localStorageService', function (FLAGS, localStorageService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                order: '@order'
            },
            templateUrl: '/app/Layout/Locales/_locales.html',
            controller: ['$rootScope', '$scope', '$filter', '$state', function ($rootScope, $scope, $filter, $state) {
                var orderLocales = function(locales) {
                    var ordered = [];
                    if ($scope.order && locales) {
                        var order = $scope.order.toLowerCase().split(',');

                        for (var i = 0, length = locales.length; i < length; i++) {
                            var position = order.indexOf(locales[i].code);
                            locales[i].order = length;
                            if (position != -1) {
                                locales[i].order = position;
                            }
                        }
                        ordered = $filter('orderBy')(locales, function (locale) {
                            return locale.order;
                        });
                    } else {
                        ordered = locales;
                    }
                    return ordered;
                };

                $scope.locales = orderLocales($rootScope.Info.locales);
                $scope.locale = $rootScope.currentLocale;
                $scope.localesCount = 0;
                $scope.localeIndex = 0;
                $scope.flags = FLAGS;

                $scope.changeLocale = function (locale) {
                    $scope.locale = locale;
                };

                $rootScope.$watch('currentLocale', function (newValue, oldValue) {
                    if ($rootScope.currentLocale) {
                        $scope.locales = orderLocales($rootScope.Info.locales);
                        $scope.locale = $rootScope.currentLocale;
                        $scope.localesCount = $rootScope.Info.locales.length;

                        $scope.localeIndex = (function () {
                            var result = 0;
                            for (var i= 0, array = $scope.locales, length = array.length; i<length; i++ ) {
                                if (array[i].code == $scope.locale) {
                                    result = i;
                                    break;
                                }
                            }
                            return result;
                        })();

                        $scope.$watch(
                            'locale', function (newValue, oldValue) {
                                if (newValue != oldValue) {
                                    localStorageService.set('currentLocale', newValue);
                                    $rootScope.currentLocale = newValue;
                                    $rootScope.user_language = newValue;
                                    $state.go($state.current.name, {lang:newValue});
                                }
                            }
                        );
                    }
                });
            }]
        };
    }])
    .directive ('casinoLocaleActive', ['FLAGS', function (FLAGS) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: '/app/Layout/Locales/_currentLocale.html',
            controller: ['$rootScope', '$scope', function ($rootScope, $scope) {
                $scope.locale = $rootScope.currentLocale;
                $scope.flags = FLAGS;

                $rootScope.$watch('currentLocale', function (newValue, oldValue) {
                    if ($rootScope.currentLocale && newValue != oldValue) {
                        $scope.locale = $rootScope.currentLocale;
                    }
                });

            }]
        };
    }]);
