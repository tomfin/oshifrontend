CasinoDirectives
    .directive('mainSlider', function() {
        return {
          restrict: 'E',
          scope: false,
          link: function(scope, elem, attr) {
            if (attr.type === 'text/javascript-lazy') {
              var code = elem.text();
              var f = new Function(code);
              f();
            }
          }
        };
    })
    .controller('Home', ['$scope','$location','$window', function($scope,$location, $window) {
       $scope.isHome = function(path) {
	    if ($window.location.pathname === '/') {
	      return true;
	    } else {
	      return false;
	    }
	};
        
    }
]);
    