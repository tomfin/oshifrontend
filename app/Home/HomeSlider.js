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
}).controller(
		'Home',
		[ '$scope', '$location', '$window', '$stateParams', '$timeout', 'AuthModalService',
				function($scope, $location, $window, $stateParams, $timeout, AuthModalService) {
					$scope.displayBanner = function() {
						if ($window.location.pathname === '/' || $window.location.pathname.startsWith('/games') || $window.location.pathname.startsWith('/rego')) {
							return true;
						} else {
							return false;
						}
					};

					$scope.auth_modal = {
							showLogin: AuthModalService.showLogin,
							showRegistration: AuthModalService.showRegistration
					};

					$scope.init = function() {
						if ($location.$$path.startsWith('/rego')) {
							$timeout(function() {
								$scope.auth_modal.showRegistration();
							}, 500);
						} else {
							// Do nothing
						}
					}
					$scope.init();

				} ]);
