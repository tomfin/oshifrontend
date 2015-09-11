CasinoDirectives
    .directive ('casinoInsertCmsImages', [ function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            category: '@category'
        },
        templateUrl: '/app/Blocks/InsertCmsImages/_images.html',
        controller: ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
            $scope.images = [];
            $scope.state = $state;

            function image_load () {
                $scope.images = [];
                for (var key = 0; key < $rootScope.Info.files.length; key++) {
                    if ($rootScope.Info.files[key].categories.indexOf($scope.category) >= 0) {
                        $scope.images.push({image: $rootScope.Info.files[key].url});
                    }
                }
            }

            $rootScope.$watch('Info.files', function () {
                if(!!$rootScope.Info.files) {
                    image_load();
                }
            });

            if ($rootScope.Info.files) {
                image_load();
            }
        }]
    };
}]);