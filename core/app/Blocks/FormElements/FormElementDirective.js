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
            var templateUrl= '/app/Blocks/FormElements/_input.html',
                field_scope = scope.data.scope;


            scope.name = scope.data.scope + "_" + scope.data.field;

            if (field_scope == 'profile') {
                field_scope = 'profile/user'
            }

            scope.label="activerecord.attributes." + field_scope + "." + scope.data.field;
            scope.placeholder="activerecord.attributes." + field_scope + "." + scope.data.field;
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
        controller: ['$scope', '$rootScope', '$filter', 'Pages', '$compile', function ($scope, $rootScope, $filter, Pages, $compile) {
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

            if ($scope.data.name == "terms_acceptance") {

                Pages.list({l: $rootScope.currentLocale}, function(data){
                    var menu = [];
                    for (var i = 0, length = data.length; i < length; i++) {

                        if (!data[i].children && data[i].categories.indexOf('terms-page') != -1) {
                            menu.push(data[i]);
                        }

                        if (data[i].children){
                            data[i].children.forEach(function (child_page){
                                if (child_page.categories.indexOf('terms-page') != -1) {
                                    menu.push(child_page);
                                }
                            })
                        }
                    }

                    var terms_text = "";
                    if (menu.length > 0) {
                        terms_text += "<a href='/" + menu[0].path + "'>";
                    }
                    terms_text += $filter('translate')('frontend.links.terms_and_conditions');

                    if (menu.length > 0) {
                        terms_text += "</a>";
                    }

                    $scope.label = $filter('translate')('activerecord.attributes.profile/user.terms_acceptance', {text: terms_text});
                });
            }
        }]
    };
}]);
