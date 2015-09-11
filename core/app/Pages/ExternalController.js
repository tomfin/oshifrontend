CasinoControllers
    .controller('External', ['$scope', '$rootScope', '$state', '$stateParams', 'Pages', 'Info', function ($scope, $rootScope, $state, $stateParams, Pages, Info) {
        var pages = [],
            getObjectValues = function (obj) {
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

            //FIXME
            var parts = $stateParams.id.split('/');
            if (parts.length == 2 && parts[0] == 'games') {
                $state.go('games_category', {category: parts[1]});
                return false;
            }

            Pages.list({l: $rootScope.currentLocale}, function(data) {

                for (var i = 0, length = data.length; i < length; i++) {
                    pages.push(data[i].path);
                    if (data[i].children && data[i].children.length) {
                        for (var j = 0, children_length = data[i].children.length; j < children_length; j++) {
                            pages.push(data[i].children[j].path);
                        }
                    }
                }
                //TODO remove id when fix on clients
                var path = $stateParams.id || $stateParams.path;
                if (pages.indexOf(path) > -1) {
                    $state.go('cms', {path: path});
                    pages = [];
                } else {
                    //TODO return when possible
                    //if ($rootScope.Info.profile_routes) {
                    //    var links = getObjectValues($rootScope.Info.profile_routes);
                    //    for (var key in links) {
                    //        if (links[key].indexOf($stateParams.id) > -1) {
                    //            window.location.href = links[key];
                    //        }
                    //    }
                    //}
                    //else {
                    //    $state.go('404');
                    //}

                    Info.profile_routes(function(data){
                        data = data.toJSON();
                        var links = getObjectValues(data),
                            new_location = false;
                        for (var key in links) {
                            if (links[key].indexOf($stateParams.id) > -1) {
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

                }
            });
    }]);