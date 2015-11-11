CasinoServices
/**
 * @name GameData
 * @returns {object}
 * @description Service gets games data from server and stores it.
 */
    .factory('GamesData', ['Batch', 'Restrictions', '$rootScope', 'GamesCdn', '$filter', 'SYSTEM', function (Batch, Restrictions, $rootScope, GamesCdn, $filter, SYSTEM) {
        var all_games = {},
            identifier_by_id = {},
            restricted_games = {},
            device = FlashDetect.installed ? 'desktop' : 'mobile',
            available_providers = {},
            data = {
                games: {
                    by_identifier: all_games,
                    by_id: identifier_by_id,
                    restricted: restricted_games
                },
                jackpots: {},
                collections: [],
                providers: [],
                winners: {},
                currencies: {}
            };


        var prepareGames = function(games, result_games, data) {
            data = data || {};

            var jackpots = data.jackpots,
                order = data.order,
                currencies = data.currencies;

            for (var key in games) {
                var game = games[key],
                    identifier = game.identifier,
                    game_currency = game.currency || 'FUN',
                    restriction_type = Restrictions.isRestricted('game', game);

                if(restriction_type) {
                    games[key]['restriction_type'] = restriction_type;
                    games[key]['background_cdn_path'] = GamesCdn.backgroundURI(games[key]);
                    restricted_games[games[key].id] = games[key];
                    continue;
                }

                for (var device_key in game.devices) {
                    var device = game.devices[device_key];

                    if (!result_games[device]) {
                        result_games[device] = {};
                    }

                    if (!result_games[device][identifier]) {
                        var game_item = {
                            identifier: identifier,
                            title: game.title,
                            collections: game.collections,
                            provider: game.provider,
                            icon_cdn_path: GamesCdn.iconURI(game),
                            background_cdn_path: GamesCdn.backgroundURI(game),
                            currencies: {},
                            devices: game.devices
                        };

                        if (order && order[identifier]) {
                            game_item.order = order[identifier];
                        }

                        result_games[device][identifier] = game_item;

                        available_providers[game.provider] = true;
                    }

                    var game_currency_item = {
                        id: game.id,
                        play_url: game.play_url,
                        currency: game_currency
                    };

                    if (currencies && currencies[game_currency]) {
                        game_currency_item.currency_symbol = currencies[game_currency].symbol;
                    }
                    if (jackpots && jackpots[game_currency] && jackpots[game_currency][identifier]) {
                        game_currency_item.jackpot = jackpots[game_currency][identifier] / currencies[game_currency].subunits_to_unit;
                    }

                    result_games[device][identifier].currencies[game_currency] = game_currency_item;
                    identifier_by_id[game.id] = identifier;
                }
            }
            },
            prepareCollections = function (collections) {
                var res = [];
                if (!SYSTEM.INVISIBLE_COLLECTIONS) {
                    res = collections;
                } else {
                    for (var key in collections) {
                        if (SYSTEM.INVISIBLE_COLLECTIONS.indexOf(collections[key].id) == -1) {
                            res.push(collections[key]);
                        }
                    }
                }
                return res;
            },
            prepareProviders = function (providers) {
                var res = [];

                for (var key in providers) {
                    if(available_providers[providers[key].id]) {
                        res.push(providers[key]);
                    }
                }

                return res;
            },
            prepareWinners = function (winners) {
                var res = [];
                for (var key in winners) {
                    var game = winners[key];
                    if (all_games[device][game.game_identifier] && all_games[device][game.game_identifier].currencies[game.currency]) {
                        game.data = all_games[device][game.game_identifier];
                        res.push(game);
                    } else if (all_games[device][game.game_identifier + 'Flash'] && all_games[device][game.game_identifier + 'Flash'].currencies[game.currency]) {
                        game.data = all_games[device][game.game_identifier + 'Flash'];
                        game.game_identifier = game.game_identifier + 'Flash';
                        res.push(game);
                    }
                }
                return res;
            },
            prepareJackpots = function (jackpots) {
                var res = {};

                for (var currency in jackpots) {

                    for (var identifier in jackpots[currency]) {
                        if (all_games[device][identifier] && all_games[device][identifier].currencies[currency]) {
                            if (!res[currency]) {
                                res[currency] = {};
                            }
                            res[currency][identifier] = jackpots[currency][identifier];
                        }
                    }

                }
                return res;
            };
            prepareCurrencies = function (currencies) {
                var res = {};
                for (var key in currencies) {
                    res[currencies[key].code] = currencies[key];
                }
                return res;
            };

            initLatestWinners = function () {
                var client = new Faye.Client(SYSTEM.URL_PS);
                //TODO add to config and add delay
                client.subscribe('/v1/bets/**', function(game) {
                    if (game.bet_amount_cents < game.win_amount_cents && all_games[device][game.game_identifier] && all_games[device][game.game_identifier].currencies[game.currency]) {
                        game.data = all_games[device][game.game_identifier];
                        data.winners.latest.unshift(game);
                    }
                });
            };

        var fnames = {},
            Filters = function (default_filters) {
            var timer = false,

                getGamesByFilters = function () {
                    var games = all_games[device];

                    if (!games) {
                        return [];
                    }

                    games = $filter('gameCollections')(games, this.data.collection);
                    games = $filter('gameProvider')(games, this.data.provider);

                    if (!this.data.with_demo) {
                        games = $filter('gamesWithFun')(games, this.data.with_demo);
                    }

                    if (this.data.title != '') {
                        games = $filter('gameTitle')(games, this.data.title);
                    }

                    if (this.data.azOrder != 0) {
                        games = $filter('gameOrderAZ')(games, this.data.azOrder);
                    } else if (this.data.collectionOrder) {
                        games = $filter('orderByCollection')(games, this.data.collectionOrder);
                    }
                    return this.games = games;
                };


            this.games = [];
            this.data = {
                device: device,
                collection: 'all',
                provider: false,
                title: '',
                with_demo: true,
                collectionOrder: 'all',
                azOrder: 0
            };

            this.changeFilter = function (filters) {
                var that = this;
                filters = filters || {};
                clearTimeout(timer);


                if(filters.collection && this.data.collection === this.data.collectionOrder && !filters.collectionOrder) {
                    filters.collectionOrder = filters.collection;
                }

                for (var key in filters) {
                    this.data[key] = filters[key];
                }


                if (filters.title && filters.title != '') {
                    timer = setTimeout( function () {
                        getGamesByFilters.call(that);
                    }, 500);
                } else {
                    getGamesByFilters.call(this);
                }
            };

            this.changeFilter(default_filters);
        };

        return {
            inited: false,
            init: function () {
                var urls = [
                    '/api/games/',
                    '/api/games/demo',
                    '/api/games/jackpots',
                    '/api/games/order',
                    '/api/games/collections',
                    '/api/games/providers',
                    '/api/stats/winners/top',
                    '/api/stats/winners/latest',
                    '/api/restrictions',
                    '/api/restrictions/marks',
                    '/api/info/currencies',
                    '/api/stats/winners/top/BTC'
                    ],
                    that = this;

                Batch.get({'url[]':urls}, function (responce) {
                    Restrictions.init(JSON.parse(responce[8]), JSON.parse(responce[9]));

                    that.data.currencies = prepareCurrencies(JSON.parse(responce[10]));

                    var games = {},
                        games_order = JSON.parse(responce[3]),
                        games_jackpots = JSON.parse(responce[2]);

                    prepareGames(JSON.parse(responce[0]), games, {
                        jackpots: games_jackpots,
                        order: games_order,
                        currencies: that.data.currencies
                    });
                    prepareGames(JSON.parse(responce[1]), games, {order: games_order});

                    all_games = games;
                    that.data.jackpots = prepareJackpots (games_jackpots, games);

                    that.data.collections = prepareCollections (JSON.parse(responce[4]));
                    that.data.providers = prepareProviders (JSON.parse(responce[5]));

                    that.data.winners.top = prepareWinners (JSON.parse(responce[6]), games);
                    that.data.winners.latest = prepareWinners (JSON.parse(responce[7]), games);

                    var top_winners_btc = prepareWinners (JSON.parse(responce[11]), games),
                        top_winners_length = that.data.winners.top.length;

                    if (top_winners_length < 15) {
                        for (var key in top_winners_btc) {
                            var dublicate = false;
                            for (var i = 0; i < top_winners_length; i++) {
                                if (top_winners_btc[key].win_amount_cents == that.data.winners.top[i].win_amount_cents &&
                                    top_winners_btc[key].nickname == that.data.winners.top[i].nickname &&
                                    top_winners_btc[key].game_identifier == that.data.winners.top[i].game_identifier
                                ) {
                                    dublicate = true;
                                    break;
                                }
                            }
                            if(!dublicate) {
                                that.data.winners.top.push(top_winners_btc[key]);
                            }
                        }
                    }

                    for (var key in fnames) {
                        fnames[key].changeFilter();
                    }

                    initLatestWinners();

                    that.inited = true;
                });

                $rootScope.$watch('currentLocale', function (newValue, oldValue){
                    if (oldValue != newValue) {
                        urls = [
                            '/api/games/collections'
                        ];

                        Batch.get({'url[]': urls}, function (responce) {
                            that.data.collections = prepareCollections(JSON.parse(responce[0]));
                        });
                    }
                });
            },

            data: data,
            getByIdentifier: function (identifier) {
                var res = false;
                if (all_games[device] && all_games[device][identifier]) {
                    res = all_games[device][identifier];
                }
                return res;
            },
            getById: function (id) {
                return this.getByIdentifier(identifier_by_id[id]);
            },
            getGameByCurrency: function (game, default_currency) {
                if (default_currency && $rootScope.data.user.currency == 'FUN' && game.currencies[default_currency]) {
                    return game.currencies[default_currency];
                }

                if (game.currencies[$rootScope.data.user.currency]) {
                    return game.currencies[$rootScope.data.user.currency];
                }

                if (default_currency && game.currencies[default_currency]) {
                    return game.currencies[default_currency];
                }

                for (var balance_key in $rootScope.data.user.balances) {
                    if ($rootScope.data.user.balances[balance_key].code && game.currencies[$rootScope.data.user.balances[balance_key].code]) {
                        return game.currencies[$rootScope.data.user.balances[balance_key].code];
                    }
                }

                for (var currencies_key in $rootScope.Info.currencies) {
                    if ($rootScope.Info.currencies[currencies_key].code && game.currencies[$rootScope.Info.currencies[currencies_key].code]) {
                        return game.currencies[$rootScope.Info.currencies[currencies_key].code];
                    }
                }
            },
            getGameJackpotByCurrency: function (game, default_currency) {
                var res = false;
                var game_by_currency = this.getGameByCurrency(game, default_currency);

                if (game_by_currency && !game_by_currency.jackpot && default_currency && game.currencies[default_currency]) {
                      game_by_currency =  game.currencies[default_currency];
                }

                if (game_by_currency && game_by_currency.jackpot) {

                    res = $filter('casino_currency')(game_by_currency.jackpot, game_by_currency.currency_symbol)
                }
                return res;
            },

            filters: {
                get: function (name, params) {
                    if (!fnames[name]) {
                        fnames[name] = new Filters(params);
                    } else if (params) {
                        fnames[name].changeFilter(params);
                    }


                    return fnames[name];
                },

                changeByName: function (name, params) {
                    var filter = fnames[name];

                    if (filter) {
                        filter.changeFilter(params);
                    }

                }
            }
        }
    }]);
