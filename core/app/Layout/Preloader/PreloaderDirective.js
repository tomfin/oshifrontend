CasinoDirectives
    .directive ('casinoPreloader', [function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            duration: '@duration'
        },
        templateUrl: '/app/Layout/Preloader/_preloader.html',
        controller: ['$rootScope', '$scope', '$timeout', function ($rootScope, $scope, $timeout) {
            var duration = $scope.duration || 1000;
            var timeoutPreloader;

            $scope.$on('preloadShow', function (){
                $scope.show_preloader = true;

                timeoutPreloader = $timeout(function (){
                    $scope.$broadcast("preloadHide");
                }, duration * 10);

            });
            $scope.$on('preloadHide', function (){
                if (timeoutPreloader) {
                    $timeout.cancel(timeoutPreloader);
                }

                $scope.show_preloader = false;
            });


            $scope.$broadcast("preloadShow");
            $rootScope.$on('cfpLoadingBar:completed', function () {
                $timeout(function(){
                    $rootScope.$broadcast("preloadHide");
                }, duration);
            });

        }]
    };
}]);
