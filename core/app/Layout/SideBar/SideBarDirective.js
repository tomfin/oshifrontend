CasinoDirectives
    .directive ('casinoSideBar', ['$http', '$templateCache', '$compile', function ($http, $templateCache, $compile) {
    return {
        restrict: 'A',

        controller: ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
            $('.opener').on('click', function() {
                var panel = $(this).parents(".slide-panel");
                if (panel.hasClass("visible")) {
                    panel.removeClass('visible');
                } else {
                    panel.addClass('visible');
                }
                return false;
            });

            $rootScope.$watch('currentLocale', function (newValue, oldValue) {
                if ($rootScope.currentLocale && newValue != oldValue) {
                    $(".slide-panel").removeClass('visible');
                }
            });

        }]
    };
}]);