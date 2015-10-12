CasinoControllers
    .controller('GamesList', ['$scope', 'GamesList', 'Auth', '$stateParams', 'FavoriteList', 'LastPlayedList', '$state', '$rootScope', function ($scope, GamesList, Auth, $stateParams, FavoriteList, LastPlayedList, $state, $rootScope) {
        $scope.subFilter  = true;
        $scope.accessLevels = Auth.accessLevels;
        $scope.data = $rootScope.data;

        var games = [];
        $scope.games = games;
        $scope.state = $state;

        $scope.collection = $stateParams.category || $scope.category || 'all';

        $scope.limit = $scope.limit_count || 1000;//FIXME in angular v 1.4.1

        $scope.provider = $stateParams.provider || false;
        $scope.device = FlashDetect.installed ? 'desktop' : 'mobile';
        $scope.order = $stateParams.order || false;
        $scope.currency = false;
        $scope.collectionOrder = false;

        $scope.favorites = FavoriteList;
        $scope.favorites.show = $stateParams.show_favorites || false;

        $scope.jackpot = $stateParams.jackpot || false;

        $scope.lastPlayed = LastPlayedList;

        $scope.changeCollection = function (key, order) {
            $scope.collection = key;
            
            if ($scope.collectionOrder != 'novelty' && $scope.collectionOrder != 'popularity' && $scope.collectionOrder != 'all') {
                $scope.collectionOrder = key;
            }
            if (order) {
                $scope.collectionOrder = order;
            }
            if(key != 'all'){
                $scope.subFilter  = false;
            }
            else{
                $scope.subFilter  = true;
            }

        };

        $scope.changeProvider = function (key) {
            $scope.provider = key;
        };

        $scope.loadMore = function (count) {
            $scope.limit_count = parseInt($scope.limit_count) +  count;
        };

        GamesList.make($scope);
        GamesList.collections($scope);
        GamesList.providers($scope);
    }]
);
