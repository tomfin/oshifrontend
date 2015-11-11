CasinoDirectives
    .directive ('casinoGamesBlock', [ function () {

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

        templateUrl: function(elem, attr) {
            var template = attr.template || 'block';
            return '/app/Games/Block/_' + template + '.html';
        },
        controller: 'GamesBlock'
    }
}]);
