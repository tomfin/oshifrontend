CasinoDirectives
    .directive('casinoGamesFilter', ['$window', function ($window) {
        'use strict';


        return {
            require: '^?casinoGamesFilterTarget',
            link: function (scope, elm, attrs) {
                var getOffsetSum = function (elem) {
                        var top=0, left=0;
                        while(elem) {
                            top = top + parseFloat(elem.offsetTop)
                            left = left + parseFloat(elem.offsetLeft)
                            elem = elem.offsetParent
                        }

                        return {top: Math.round(top), left: Math.round(left)}
                    };

                angular.element(document.getElementsByClassName('casino-games-filter-scroll')).on('click',  function() {
                    $window.scrollTo(0, getOffsetSum(elm[0].parentNode).top + parseInt(attrs.casinoGamesFilter));
                });
            }
        };
    }]);