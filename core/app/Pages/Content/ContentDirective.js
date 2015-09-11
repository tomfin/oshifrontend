CasinoDirectives
    .directive ('casinoContent', ['$compile', '$stateParams', 'Pages', '$rootScope', function ($compile, $stateParams, Pages, $rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            content: '=content'
        },
        link: function ($scope, iElement, iAttrs) {
            var loadPages = function () {

                Pages.byId({id: $stateParams.path, l: $rootScope.currentLocale}, function(data) {
                    for (var i=0; i<iElement.length; i++) {
                        iElement[i].innerHTML = '';
                    }

                    iElement.replaceWith($compile(data.content)($scope));
                });
            };

            $rootScope.$watch('currentLocale', function (newValue, oldValue) {
                if ($rootScope.currentLocale && newValue != oldValue) {
                    loadPages();
                }
            });

            if ($rootScope.currentLocale) {
                loadPages();
            }
        }
    };
}]);