CasinoDirectives
    .directive ('casinoSnippet', ['$compile', '$parse', 'Auth', function ($compile, $parse, Auth) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            type: '@type'
        },
        template: '<div ng-bind-html="content"></div>',
        link: function(scope, element, attr) {
            var parsed = $parse(attr.ngBindHtml);

            //Recompile if the template changes
            scope.$watch(
                function() {
                    return (parsed(scope) || '').toString();
                },
                function() {
                    $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
                }
            );
        },
        controller: ['$scope', 'Snippets', "$sce", function ($scope, Snippets, $sce) {
            $scope.accessLevels = Auth.accessLevels;
            Snippets.add(function(){
                var data = Snippets.getByName($scope.type);

                $scope.content = $sce.trustAsHtml(data.content);
            });
        }]
    };
}]);