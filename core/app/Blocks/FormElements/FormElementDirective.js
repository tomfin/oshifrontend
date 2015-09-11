CasinoDirectives
    .directive ('casinoFormElement', ['$http', '$templateCache', '$compile', 'FormRegistrationService', function ($http, $templateCache, $compile,FormRegistrationService) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            data: "=data",
            value: "=ngModel",
            errors: "=errors"
        },
        link: function (scope, iElement, iAttrs) {
            var templateUrl= '/app/Blocks/FormElements/_input.html';

                scope.name = scope.data.scope + "_" + scope.data.field;
                scope.label="activerecord.attributes." + scope.data.scope + "." + scope.data.field;
                scope.placeholder="activerecord.attributes." + scope.data.scope + "." + scope.data.field;
                if (scope.data.localData.value != undefined) {
                    scope.value = scope.data.localData.value;
                }

            switch(scope.data.localData.type) {
                case 'currency':
                case 'country':
                case 'language':
                case 'time_zone':
                case 'select':
                    templateUrl = '/app/Blocks/FormElements/_select.html';
                    break;
                case 'date':
                    templateUrl = '/app/Blocks/FormElements/_date.html';
                    break;
                case "radio":
                    templateUrl = '/app/Blocks/FormElements/_radio.html';
                    break;
                case "checkbox":
                    templateUrl = '/app/Blocks/FormElements/_checkbox.html';
                    break;
                default:
                    templateUrl = '/app/Blocks/FormElements/_input.html';
                    break;
            }

            if (scope.data.name == "terms_acceptance") {
                templateUrl = '/app/Blocks/FormElements/_terms_acceptance.html';
            }

            $http.get('/app/Blocks/FormElements/_element.html', {cache: $templateCache}).success(function(tplContent){
                $http.get(templateUrl, {cache: $templateCache}).success(function(tplContentElement){
                    iElement.replaceWith($compile(tplContent.replace('<!--element-->', tplContentElement))(scope));
                });
            });
        },
        controller: ['$scope', '$rootScope', '$translate', function ($scope, $rootScope, $translate) {

            if ($scope.data.localData.type == 'date') {

                $scope.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.opened = true;
                };

                $scope.datepickerOptions = {
                    "show-button-bar": false,
                    showWeeks: false
                };

            }
        }]
    };
}]);
