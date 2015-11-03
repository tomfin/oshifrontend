//'use strict';

// Declare app level module which depends on filters, and services
angular.module(
 'casino', [
	 'ui.bootstrap',
	 'ui.router',
	 'ngSanitize',
	 'chieffancypants.loadingBar',
	 'pascalprecht.translate',
	 'casino.filters',
	 'casino.services',
	 'casino.directives',
	 'casino.controllers',
	 'casino.constants',
	 'angular.lazyimg',
	 'myscrollfix',
	 'cgNotify',
	 'LocalStorageModule',
     'infinite-scroll'
 ]
)
 .config(['$httpProvider', function ($httpProvider) {
	 $httpProvider.defaults.withCredentials = true;
	 $httpProvider.interceptors.push('apiHeaders');
 }])

 .config(['$provide', function ($provide) {
	 $provide.decorator('$state',["$delegate", "$stateParams", function ($delegate, $stateParams) {
		 $delegate.forceReload = function () {
			 return $delegate.go($delegate.current, $stateParams, {
				 reload: true,
				 inherit: false,
				 notify: true
			 });
		 };
		 return $delegate;
	 }]);
 }])
 .config(["localStorageServiceProvider", function (localStorageServiceProvider) {
	 localStorageServiceProvider
	  .setPrefix('');
 }])
 .config(['$translateProvider', function ($translateProvider) {
	 $translateProvider.useStaticFilesLoader({
		 prefix: '/i18n/',
		 suffix: '.json'
	 });

	 var currentLocale;

	 try {
		 localStorage.setItem("testKey", 1);
		 localStorage.removeItem("testKey");
		 currentLocale = localStorage.getItem("currentLocale");
	 } catch (error) {
		 var result = document.cookie.match(new RegExp("currentLocale" + '=([^;]+)'));
		 if(result && result[1]) {
			 currentLocale = decodeURIComponent(result[1]);
		 }
	 }

     if (currentLocale) {
		 $translateProvider.preferredLanguage(currentLocale.replace(/"/g,''));
	 }

 }])

 .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$urlMatcherFactoryProvider', 'AUTH_PARAMS', function ($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider, AUTH_PARAMS) {
	 $urlMatcherFactoryProvider.type('nonURIEncoded', {
		 encode: function (v) {
			 return v || '';
		 },
		 decode: function (v) {
			 return v || '';
		 },
		 is: function (v) {
			 return true;
		 }
	 });

	 $urlRouterProvider
	     .when('/play_for_real', ['$state', function ($state) {
	         $state.go('users_sign_up');
	     }]);

	$urlRouterProvider.rule(function ($injector, $location) {
		var path = $location.path(),
			path_length = path.length;

		if (path[path_length - 1] == '/' && path_length > 1){
			path = path.slice(0, path_length - 1);
		}

		$location.replace().path(path);
	});

	 $stateProvider
	  .state('home', {
		  url: '/?rego',
	  	templateUrl: '/app/Home/_home.html',
	  	controller: function($scope, $stateParams) {
	  		$scope.rego = $stateParams.rego;
	  	},
		params: {
			 registration: {
				 data: {},
				 fields: {},
				 errors: {}
			 }
		}

	  })
	  .state('game', {
		  url: '/game/:type/:name/:id',
		  controller: 'Game',
		  templateUrl: '/app/Game/_game.html'
	  })
	  .state('games', {
		  url: '/games',
		  params: {
			  category: null,
			  provider: null,
			  order: null,
			  show_favorites: false,
			  jackpot: false
		  },
		  templateUrl: '/app/Games/_games.html'
	  })
	  .state('games_category', {
		  url: '/games/{category}',
		  templateUrl: '/app/Games/_games.html'
	  })
	  .state('users_sign_up', {
		  url: '/users/sign_up',
		  params: {
			  registration: {
				  data: {},
				  fields: {},
				  errors: {}
			  }
		  },
		  templateUrl: function () {
			  var template = '';

			  if (AUTH_PARAMS.SIGN_UP_MODE == 'page') {
				  template = '/app/Auth/Registration/_registration.html'
			  }
			  return template;
		  },
		  controllerProvider: function () {
			  var controller = '';
			  if (AUTH_PARAMS.SIGN_UP_MODE == 'page') {
				  controller = 'Registration'
			  }
			  if (AUTH_PARAMS.SIGN_UP_MODE == 'modal') {
				  controller = 'SignUpRedirectController'
			  }
			  return controller;
		  },
		  data: {
			  AUTH_PARAMS: AUTH_PARAMS
		  }
	  })
	  .state('users_sign_in', {
		  url: '/users/sign_in',
		  templateUrl: function () {
			  var template = '';

			  if (AUTH_PARAMS.SIGN_IN_MODE == 'page') {
				  template = '/app/Auth/Login/_login.html'
			  }
			  return template;
		  },
		  controllerProvider: function () {
			  var controller = '';

			  if (AUTH_PARAMS.SIGN_IN_MODE == 'page') {
				  controller = 'LoginCtrl'
			  }
			  if (AUTH_PARAMS.SIGN_IN_MODE == 'modal') {
				  controller = 'SignInRedirectController'
			  }
			  return controller;
		  },
		  data: {
			  AUTH_PARAMS: AUTH_PARAMS
		  }
	  })
	  .state('users_password_new', {
		  url: '/users/password/new',
		  controller: 'ForgotPassword',
		  templateUrl: '/app/Auth/ForgotPassword/_forgot_password.html'
	  })
	  .state('users_password_edit', {
		  url: '/users/password/edit',
		  controller: 'ResetPasswordController',
		  templateUrl: '/app/Auth/ResetPassword/_reset_password.html'
	  })
	  .state('users_confirmation_new', {
		  url: '/users/confirmation/new',
		  controller: 'ConfirmationController',
		  templateUrl: '/app/Auth/Confirmation/_confirmation.html'
	  })
	  .state('users_confirmation', {
		  url: '/users/confirmation',
		  controller: 'ConfirmationController'
	  })
	  .state('users_unlock_new', {
		  url: '/users/unlock/new',
		  controller: 'UnlockController',
		  templateUrl: '/app/Auth/Unlock/_unlock.html'
	  })
	  .state('users_unlock', {
		  url: '/users/unlock',
		  controller: 'UnlockController'
	  })
	  .state('support', {
		  url: '/support',
		  controller: 'Support',
		  templateUrl: '/app/Pages/Support/_support.html'
	  })
	  .state('landing', {
		  url: '/landing',
		  views: {
			  "landing": {
				  controller: 'Landing',
				  templateUrl: '/app/Pages/Landing/_landing.html'
			  }
		  }
	  })
	  .state('404', {
		  templateUrl: '/app/404/_404.html'
	  })
	  .state('external', {
		  url: '/{id:nonURIEncoded}',
		  controller: 'External'
	  })
	  .state('cms', {
		  templateUrl: '/app/Pages/_page.html',
		  params: {
		  	 path: null
		  }
	  })

		 //.state('backend_pages', {
		 //    url: '/{id}',
		 //    controller: 'External'
		 //})


	 ;

	 $locationProvider.html5Mode(true);
	 $locationProvider.hashPrefix('!');

 }
 ])
 .run(['$rootScope', 'Init', 'Auth', '$translate', '$state', 'Snippets', 'Pages', '$q', 'External', 'Geoip', function ($rootScope, Init, Auth, $translate, $state, Snippets, Pages, $q, External, Geoip) {

    $rootScope.data = {
        user: {},
        device: FlashDetect.installed ? 'desktop' : 'mobile'
    };

	 $rootScope.accessLevels = Auth.accessLevels;
	 $rootScope.page = {title: '', snippet_title: ''};
	 $rootScope.user = Auth.user;
	 $rootScope.demo_mode = false;

	 $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		 $rootScope.mainModal.close();
		 $rootScope.page.title = '';
	 });

	 $rootScope.getSeoData = function (page_id) {
		 var defer = $q.defer();
		 var clearSeoData = function () {
			 $rootScope.page.title = '';
			 $rootScope.page.keywords = '';
			 $rootScope.page.description = '';
			 $rootScope.page.content = '';
			 $rootScope.page.game_title = false;
		 };


		 Pages.list({l: $rootScope.currentLocale}).$promise
		  .then(function (pages) {

				 //TODO rewrite to recursion
			  var page_found = pages.some(function (page) {
				  if (page.children) {
					  return page.children.some(function (page) {
							  return page.path == page_id;
					  });
				  } else {
					  return page.path == page_id;
				  }
			  });

			  if (page_found) {
				  Pages.byId({id: page_id, l: $rootScope.currentLocale}).$promise
				   .then(function (data) {
					   $rootScope.page.title = data.blocks.title;
					   $rootScope.page.keywords = data.blocks.keywords;
					   $rootScope.page.description = data.blocks.description;
					   $rootScope.page.content = data.content;

					   defer.resolve(data);
				   })
				   .catch(function (error) {
					   clearSeoData();
					   defer.reject({
						   response: error
					   })
				   });
			  } else {
				  clearSeoData();
				  defer.reject({
					  page: "Not found page id:" + page_id,
					  page_list: pages
				  })
			  }
		  });


		 return defer.promise;
	 };

	 $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		 if (toState.name == 'external' || fromState.name == '') {
			 return
		 }

		 $rootScope.getSeoData(toState.name == 'cms' ? toParams.path : toState.name);
	 });

	 //TODO remove?
	 $rootScope.state = $state;

	 $rootScope.mainModal = {
		 close: function () {
			 try {
				 if ($rootScope.mainModal.modal) {
					 $rootScope.mainModal.modal.close();
				 }
			 }
			 catch (e) {
			 }
		 },
		 modal: null
	 };

	 async.series([
		 function (callback) {
			 Init.local(callback);
			 $rootScope.Geo = {};
			 Geoip.data(function (data){
				 $rootScope.Geo = data;
			 });
		 },
		 function (callback) {
			 $translate.use($rootScope.currentLocale);
			 callback();
		 },
		 function (callback) {
			 $rootScope.$watch(
			  'currentLocale', function (newValue, oldValue) {
				  if ($rootScope.currentLocale && newValue != oldValue) {
					  $translate.use($rootScope.currentLocale);
				  }
			  }
			 );
			 callback();
		 },
		 function (callback) {

			 if ($state.current.name == 'external') {
				 callback();
				 return;
			 }

			 $rootScope.getSeoData($state.current.name == 'cms' ? $state.params.path : $state.current.name)
			  .finally(function () {
				  callback();
			  });

			 $rootScope.$watch(
			  'currentLocale', function (newValue, oldValue) {
				  if ($rootScope.currentLocale && newValue != oldValue) {
					  $rootScope.getSeoData($state.current.name == 'cms' ? $state.params.path : $state.current.name)
				  }
			  }
			 );
		 },
		 function (callback) {
			 Init.data(callback);
		 },
		 function (callback) {
			 Init.files(callback);

			 $rootScope.$watch("currentLocale", function (newValue, oldValue) {
				 if ($rootScope.currentLocale && newValue != oldValue) {
					 Init.files();
				 }
			 });

		 },
		 function (callback) {
			 Snippets.add(function () {
				 $rootScope.page.snippet_title = Snippets.getByName('casino-title').content;
			 });

			 Snippets.init();
			 callback();
		 },
		 function (callback) {
			 External.init();
			 callback();
		 }
	 ]);

 }])


/**
 * Adds a 'ui-scrollfix' class to the element when the page scrolls past it's position.
 * @param [offset] {int} optional Y-offset to override the detected offset.
 *   Takes 300 (absolute) or -300 or +300 (relative to detected)
 */
angular.module('myscrollfix', []).directive('uiScrollfix', ['$window', '$timeout', function ($window, $timeout) {
	'use strict';

	function getWindowScrollTop() {
		if (angular.isDefined($window.pageYOffset)) {
			return $window.pageYOffset;
		} else {
			var iebody = (document.compatMode && document.compatMode !== 'BackCompat') ? document.documentElement : document.body;
			return iebody.scrollTop;
		}
	}

	return {
		require: '^?uiScrollfixTarget',
		link: function (scope, elm, attrs, uiScrollfixTarget) {
			var absolute = true,
			 shift = 0,
			 fixLimit,
			 $target = uiScrollfixTarget && uiScrollfixTarget.$element || angular.element($window),
			 getOffsetSum = function (elem) {
				 var top = 0, left = 0;
				 while (elem) {
					 top = top + parseFloat(elem.offsetTop);
					 left = left + parseFloat(elem.offsetLeft);
					 elem = elem.offsetParent
				 }

				 return {top: Math.round(top), left: Math.round(left)}
			 };

			if (!attrs.uiScrollfix) {
				absolute = false;
			} else if (typeof(attrs.uiScrollfix) === 'string') {
				// charAt is generally faster than indexOf: http://jsperf.com/indexof-vs-charat
				if (attrs.uiScrollfix.charAt(0) === '-') {
					absolute = false;
					shift = -parseFloat(attrs.uiScrollfix.substr(1));
				} else if (attrs.uiScrollfix.charAt(0) === '+') {
					absolute = false;
					shift = parseFloat(attrs.uiScrollfix.substr(1));
				}
			}

			fixLimit = absolute ? attrs.uiScrollfix : getOffsetSum(elm[0]).top + shift;

			var scrollTop = false;
			function onScroll() {
				if ($window.scrollTop == 0) {
					return false;
				}
				var limit = absolute ? attrs.uiScrollfix : getOffsetSum(elm[0]).top + shift;
				// if pageYOffset is defined use it, otherwise use other crap for IE
				var offset = uiScrollfixTarget ? $target[0].scrollTop : getWindowScrollTop();

				if (limit == -1) {
					$timeout(function () {
						scrollTop || $window.scrollTo(0, 0);
					}, 0);
				} else if (limit >= 0) {
					scrollTop = true;
				}

				if (!elm.hasClass('ui-scrollfix') && offset > limit && limit > 0) {
					elm.addClass('ui-scrollfix');
					fixLimit = limit;
				} else if (elm.hasClass('ui-scrollfix') && offset < fixLimit) {
					elm.removeClass('ui-scrollfix');
				}
			}

			$target.on('scroll', onScroll);

			// Unbind scroll event handler when directive is removed
			scope.$on('$destroy', function () {
				$target.off('scroll', onScroll);
			});
		}
	};
}])


;


var CasinoFilters = angular.module('casino.filters', []),
 CasinoServices = angular.module('casino.services', ['ngResource']),
 CasinoControllers = angular.module('casino.controllers', []),
 CasinoDirectives = angular.module('casino.directives', []),
 CasinoConstants = angular.module('casino.constants', []);
