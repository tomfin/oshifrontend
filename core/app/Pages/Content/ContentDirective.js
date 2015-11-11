CasinoDirectives
    .directive ('casinoContent', ['$compile', '$stateParams', 'Pages', '$rootScope', '$state', 'Info', function ($compile, $stateParams, Pages, $rootScope, $state, Info) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            content: '=content'
        },
        link: function ($scope, iElement, iAttrs) {
            var loadPages = function () {
                var getObjectValues = function (obj) {
                    var values = [];
                    for (var key in obj) {
                        if (typeof obj[key] == 'object') {
                            var _values = getObjectValues(obj[key]);
                            for (var _key in _values) {
                                values.push(_values[_key]);
                            }
                        } else {
                            values.push(obj[key]);
                        }
                    }
                    return values;
                };

                Pages.byId({id: $stateParams.path, l: $rootScope.currentLocale}, function(data) {
                    for (var i=0; i<iElement.length; i++) {
                        iElement[i].innerHTML = '';
                    }

                    iElement.append($compile(data.content)($scope));
                }, function (){
                    //TODO move here when add target all link profile and deposit only state.go to 404
                    Info.profile_routes(function(data){
                        data = data.toJSON();
                        var links = getObjectValues(data),
                            new_location = false;
                        for (var key in links) {
                            if (links[key].indexOf($stateParams.path) > -1) {
                                new_location = links[key];
                                break;
                            }
                        }

                        if (new_location) {
                            window.location.href = new_location;
                        } else {
                            $state.go('404');
                        }
                    });
                });
            };

            $rootScope.$watch('currentLocale', function (newValue, oldValue) {
                if ($rootScope.currentLocale && newValue != oldValue) {
                    loadPages();
                }
            });

            if ($rootScope.currentLocale) {
                loadPages();
            }
        }
    };
}]);
