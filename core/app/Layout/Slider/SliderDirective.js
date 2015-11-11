CasinoDirectives
    .directive ('casinoSlider',[  function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            category: '@category'
        },
        templateUrl: '/app/Layout/Slider/_slider.html',
        controller: ['$scope', '$rootScope', '$state', '$sce', function ($scope, $rootScope, $state, $sce) {
            var IsJsonString =  function(str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            };

            $scope.slides = [];
            $scope.state = $state;
            $rootScope.$watch('Info.files', function () {
                if(!!$rootScope.Info.files) {
                    $scope.slides = [];
                    for (var key = 0; key < $rootScope.Info.files.length; key++) {
                        if ($rootScope.Info.files[key].categories.indexOf($scope.category) >= 0) {
                            var slide = {};
                            slide.image = $rootScope.Info.files[key].url;

                            if (!IsJsonString($rootScope.Info.files[key].description)) {
                                slide.description = $sce.trustAsHtml($rootScope.Info.files[key].description);
                            }

                            $scope.slides.push(slide);

                        }
                    }
                }
            });

        }]
    };
}]);
