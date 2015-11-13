CasinoDirectives.directive('mainSlider', function() {
	return {
		restrict : 'E',
		scope : false,
		link : function(scope, elem, attr) {
			if (attr.type === 'text/javascript-lazy') {
				var code = elem.text();
				var f = new Function(code);
				f();
			}
		}
	};
});

CasinoControllers.controller(
		'Home',
		[ '$scope', '$location', '$window', '$stateParams', '$timeout', '$rootScope', 'AuthModalService',
				function($scope, $location, $window, $stateParams, $timeout, $rootScope, AuthModalService) {
					$scope.displayBanner = function() {
						if ($window.location.pathname === '/' || $window.location.pathname.startsWith('/games') || $window.location.pathname.startsWith('/rego')) {
							return true;
						} else {
							return false;
						}
					};

					$scope.init = function() {
						if ($location.$$path.startsWith('/rego')) {
							var user = {};
							$timeout(function() {
								if ($rootScope.data.user.email) {
									$window.location.href = "https://www.oshi.io/accounts/BTC/deposit";
								} else {
									$timeout(function() {
										AuthModalService.showRegistration();
									}, 500);
								}
							}, 500);
						} else {
							// Do nothing
						}
					}
					$scope.init();

				} ]);
