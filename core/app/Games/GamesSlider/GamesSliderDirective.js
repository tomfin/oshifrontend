CasinoDirectives
    .directive ('casinoGamesSlider', [ function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            name: '@name',
            template: '@template',
            default_filters: "=filters",
            limit_count: "@limit",
            isolated: '@isolated'
        },
        templateUrl: function(elem, attr){
            return '/app/Games/GamesSlider/_' + attr.template + '_slider.html';
        },
        controller: 'GamesBlock'
    };
}])
.directive('uixBxslider', function(){
    return {
        restrict: 'A',
        link: function($scope, iElm, iAttrs, controller) {
            var uixBxslider = iAttrs.uixBxslider ? $scope.$eval('{' + iAttrs.uixBxslider + '}') : {
                    mode: 'horizontal',
                    pager: false,
                    controls: true,
                    minSlides: 1,
                    maxSlides:20,
                    slideWidth: 250,
                    adaptiveHeight:true,
                    slideMargin:0,
                    infiniteLoop: false,
                    moveSlides: 4
                };

            $scope.$on('repeatFinished', function () {
                $(iElm).bxSlider(uixBxslider);
            });
        }
    }
}).directive('notifyWhenRepeatFinished', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, iElm, iAttrs) {
                if ($scope.$last === true) {
                    $timeout(function () {
                        $scope.$emit('repeatFinished');
                    });
                }
            }
        }
    }
]);
