CasinoDirectives
    .directive ('casinoGeoShow', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                var geo = false,
                    checkGeo = function (data) {
                        if (data.country_code == undefined) {
                            return;
                        }

                        if (geo && geo.indexOf(data.country_code) > -1) {
                            element.css('display', 'block');
                        } else {
                            element.css('display', 'none');
                        }
                    };

                attrs.$observe('casinoGeoShow', function (al) {
                    if (al) {
                        geo = al;
                    }
                });
                $rootScope.$watch('Geo', function(new_val, old_val) {
                    if (new_val != old_val) {
                        checkGeo(new_val);
                    }
                });
                checkGeo($rootScope.Geo);
            }
        }
    }])
    .directive ('casinoGeoHide', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                var geo = false,
                    checkGeo = function (data) {
                        if (data.country_code == undefined) {
                            return;
                        }

                        if (geo && geo.indexOf(data.country_code) > -1) {
                            element.css('display', 'none');
                        } else {
                            element.css('display', 'block');
                        }
                    };

                attrs.$observe('casinoGeoHide', function (al) {
                    if (al) {
                        geo = al;
                    }
                });
                $rootScope.$watch('Geo', function(new_val, old_val) {
                   if (new_val != old_val) {
                       checkGeo(new_val);
                   }
                });
                checkGeo($rootScope.Geo);
            }
        };
    }]);