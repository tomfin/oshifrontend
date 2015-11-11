CasinoControllers
    .controller('Landing', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {
        $state.go('home', {lang: $rootScope.currentLocale});
    }]);
