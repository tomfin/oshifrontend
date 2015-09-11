CasinoDirectives
    .directive ('casinoGamesList', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                category: "@category",//default category
                limit_count: "@limit",
            },
            templateUrl: '/app/Games/List/_list.html',
            controller: 'GamesList'
        }
    }]);
