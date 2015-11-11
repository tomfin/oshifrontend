CasinoControllers
    .controller('GamesBlock', ['$scope', '$rootScope', 'GamesData', 'Auth', '$stateParams', 'FavoriteList', 'LastPlayedList', '$state', function ($scope, $rootScope, GamesData, Auth, $stateParams, FavoriteList, LastPlayedList, $state) {
        var collection = false,
            provider = false;

        if (!$scope.isolated) {
            collection = $stateParams.category || false;
            provider = $stateParams.provider || false;

        }
        $scope.limit = $scope.limit_count || 1000;//FIXME in angular v 1.4.1


        $scope.accessLevels = Auth.accessLevels;
        $scope.data = $rootScope.data;

        $scope.state = $state;

        $scope.favorites = FavoriteList;
        $scope.favorites.show = $stateParams.show_favorites || false;

        $scope.lastPlayed = LastPlayedList;


        $scope.loadMore = function (count) {
            $scope.limit_count = parseInt($scope.limit_count) +  count;
        };


        $scope.gamesData = GamesData;


        if (collection && $scope.default_filters) {
            $scope.default_filters.collection = collection;
        }

        if (provider && $scope.default_filters) {
            $scope.default_filters.provider = provider;
        }

        $scope.filters = GamesData.filters.get($scope.name, $scope.default_filters);


        var getOffsetSum = function (elem) {
            var top=0, left=0;
            while(elem) {
                top = top + parseFloat(elem.offsetTop);
                left = left + parseFloat(elem.offsetLeft);
                elem = elem.offsetParent
            }

            return {top: Math.round(top), left: Math.round(left)}
        };

        $scope.stateGo = function (state, params){
            params = params || {};
            params.lang = $rootScope.currentLocale;

            var elm = $('.casino-filter-inner');
            var topPos = 0;

            if (elm[0]) {
                topPos = getOffsetSum(elm[0].parentNode).top + parseInt(elm.attr('casino-games-filter'));
            }

            if (topPos != $(window).scrollTop()) {
                $('body').animate({scrollTop: topPos}, {
                    duration: 300,
                    complete: function () {
                        state && $state.transitionTo(state, params);
                    }
                });
            } else {
                state && $state.transitionTo(state, params);
            }
        };

    }]
);

