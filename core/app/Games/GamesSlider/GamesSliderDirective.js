CasinoDirectives
    .directive ('casinoGamesSlider', [ function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            type: "@type"
        },
        templateUrl: function(elem, attr){
            return '/app/Games/GamesSlider/_' + attr.type + '_slider.html';
        },
        controller: 'GamesList'
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
