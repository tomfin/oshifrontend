CasinoControllers
    .controller('App', ['$rootScope', 'siteLanguage', 'language', '$translate', 'Init', 'Snippets', 'External', 'GamesData', function ($rootScope, siteLanguage, language, $translate, Init, Snippets, External, GamesData) {

        siteLanguage.check();

        if (language) {
            GamesData.init();
            async.series([
                function (callback) {
                    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                        //TODO get page_name from name - app do not forgot watcher
                        if (toState.page_name == 'external' || fromState.page_name == '') {
                            return
                        }

                        $rootScope.getSeoData(toState.page_name == 'cms'? toParams.path : toState.page_name);
                    });
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
                    Init.data(callback);
                },
                function (callback) {
                    Init.currency();
                    callback();
                },
                function (callback) {
                    Init.files(callback);

                    $rootScope.$watch("currentLocale",function (newValue, oldValue) {
                        if ($rootScope.currentLocale && newValue != oldValue) {
                            Init.files();
                        }
                    });

                },
                function (callback) {
                    Snippets.add(function(){
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
        }

        /*
        * Если пользователь есть, редиректить пользователя на язык из профиля
        * Если в профиле нет языка, ставить язык урла как главрый
        * / это дефолтный язык сайта
        * */
    }]);
