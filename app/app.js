//'use strict';

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
        'infinite-scroll',
        'angular-carousel'
    ]
)
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.interceptors.push('apiHeaders');
    }])

    .config(['$provide', function ($provide) {
        $provide.decorator('$state', ["$delegate", "$stateParams", function ($delegate, $stateParams) {
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

            if (currentLocale == null) {
                currentLocale = 'en';
                localStorage.setItem("currentLocale", currentLocale);
            }
        } catch (error) {
            var result = document.cookie.match(new RegExp("currentLocale" + '=([^;]+)'));
            if (result && result[1]) {
                currentLocale = decodeURIComponent(result[1]);
            }
        }

        if (currentLocale) {
            $translateProvider.preferredLanguage(currentLocale.replace(/"/g, ''));
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
            is: function () {
                return true;
            }
        });

        $urlRouterProvider
            .when('/play_for_real', ['$state', '$rootScope', function ($state, $rootScope) {
                $state.go('app.users_sign_up', {lang: $rootScope.currentLocale});
            }]);

        $urlRouterProvider
            .when('/', ['$state', '$rootScope', function ($state, $rootScope) {
                if ($rootScope.currentLocale == null) {
                    $rootScope.currentLocale = 'en';
                    localStorage.setItem("currentLocale", $rootScope.currentLocale);
                }
                $state.go('home', {lang: $rootScope.currentLocale});
            }]);


        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.path(),
                path_length = path.length;

            if (path[path_length - 1] == '/' && path_length > 1) {
                path = path.slice(0, path_length - 1);
            }

            $location.replace().path(path);
        });

        $stateProvider
            .state('app', {
                abstract: true,
                url: '{lang:/[a-z][a-z]|}',
                template: '<ui-view/>',
                controller: 'App',
                resolve: {
                    language: ['siteLanguage', '$rootScope', function (siteLanguage, $rootScope) {
                        if (!$rootScope.default_language) {
                            return siteLanguage.run();
                        }
                        return false;
                    }]
                }
            })
            .state('home-rego', {
            	page_name: 'home-rego',
                url: '/rego',
                templateUrl: '/app/Home/_home.html',
                controller: 'App',
                params: {
                    registration: {
                        data: {},
                        fields: {},
                        errors: {}
                    }
                },
                resolve: {
                    language: ['siteLanguage', '$rootScope', '$stateParams', function (siteLanguage, $rootScope, $stateParams) {
                    	$stateParams.lang = '';
                        if (!$rootScope.default_language) {
                            return siteLanguage.run();
                        }
                        return false;
                    }]
                }

            })
            .state('home', {
                page_name: 'home',
                url: '/{lang:[a-z][a-z]|}',
                templateUrl: '/app/Home/_home.html',
                controller: 'App',
                params: {
                    registration: {
                        data: {},
                        fields: {},
                        errors: {}
                    }
                },
                resolve: {
                    language: ['siteLanguage', '$rootScope', function (siteLanguage, $rootScope) {
                        if (!$rootScope.default_language) {
                            return siteLanguage.run();
                        }
                        return false;
                    }]
                }
            })
            .state('app.game', {
                page_name: 'game',
                url: '/game/:type/:name/:id',
                controller: 'Game',
                templateUrl: '/app/Game/_game.html'
            })
            .state('app.games', {
                page_name: 'games',
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
            .state('app.games_category', {
                page_name: 'games_category',
                url: '/games/{category}',
                templateUrl: '/app/Games/_games.html'
            })
            .state('app.users_sign_up', {
                page_name: 'users_sign_up',
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
            .state('app.users_sign_in', {
                page_name: 'users_sign_in',
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
            .state('app.users_password_new', {
                page_name: 'users_password_new',
                url: '/users/password/new',
                controller: 'ForgotPassword',
                templateUrl: '/app/Auth/ForgotPassword/_forgot_password.html'
            })
            .state('app.users_password_edit', {
                page_name: 'users_password_edit',
                url: '/users/password/edit',
                controller: 'ResetPasswordController',
                templateUrl: '/app/Auth/ResetPassword/_reset_password.html'
            })
            .state('app.users_confirmation_new', {
                page_name: 'users_confirmation_new',
                url: '/users/confirmation/new',
                controller: 'ConfirmationController',
                templateUrl: '/app/Auth/Confirmation/_confirmation.html'
            })
            .state('app.users_confirmation', {
                page_name: 'users_confirmation',
                url: '/users/confirmation',
                controller: 'ConfirmationController'
            })
            .state('app.users_unlock_new', {
                page_name: 'users_unlock_new',
                url: '/users/unlock/new',
                controller: 'UnlockController',
                templateUrl: '/app/Auth/Unlock/_unlock.html'
            })
            .state('app.users_unlock', {
                page_name: 'users_unlock',
                url: '/users/unlock',
                controller: 'UnlockController'
            })
            .state('app.support', {
                page_name: 'support',
                url: '/support',
                controller: 'Support',
                templateUrl: '/app/Pages/Support/_support.html'
            })
            .state('app.landing', {
                page_name: 'landing',
                url: '/landing',
                controller: 'Landing',
                templateUrl: '/app/Pages/Landing/_landing.html'

            })
            .state('404', {
                page_name: '404',
                templateUrl: '/app/404/_404.html'
            })
            .state('app.cms', {
                page_name: 'cms',
                url: '/{path:nonURIEncoded}',
                templateUrl: '/app/Pages/_page.html',
                params: {
                    path: null
                }
            })
            .state('app.external', {
                page_name: 'external',
                //url: '/*id',
                url: '/{id:nonURIEncoded}', //DEV?
                controller: 'External'
            })

        ;

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

    }
    ])
    .run(['$rootScope', 'Init', 'Auth', '$translate', '$state', 'Snippets', 'Pages', '$q', 'External', 'Geoip', 'siteLanguage', 'GamesData', 'FavoriteList', 'Autoscroll', function ($rootScope, Init, Auth, $translate, $state, Snippets, Pages, $q, External, Geoip, siteLanguage, GamesData, FavoriteList, Autoscroll) {

        $rootScope.Autoscroll = Autoscroll;

        $rootScope.data = {
            user: {},
            restrictions: {},
            state: $state,
            games: GamesData,
            favorites: FavoriteList,
            device: FlashDetect.installed ? 'desktop' : 'mobile'
        };

        $rootScope.accessLevels = Auth.accessLevels;
        $rootScope.page = {title: '', snippet_title: ''};
        $rootScope.user = Auth.user;
        $rootScope.demo_mode = false;
        $rootScope.Geo = {};
        $rootScope.state = $state;

        siteLanguage.init();

        $rootScope.$on('$stateChangeStart', function () {
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
                            return page.path == page_id || page.children.some(function (page) {
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

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (toState.page_name == 'external' || fromState.page_name == '') {
                return
            }

            var page_name = toState.page_name == 'cms' ? toParams.path : toState.page_name,
                page_name = toState.page_name == 'games_category' ? 'games/' + toParams.category : page_name;

            $rootScope.getSeoData(page_name);
        });

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

    }]);


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
