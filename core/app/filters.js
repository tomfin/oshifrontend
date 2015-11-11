'use strict';

/* Filters */

CasinoFilters
    .filter('unique', function() {
        return function (arr, field) {
            var o = {}, i, l = arr.length, r = [];
            for(i = 0; i < l; i += 1) {
                o[arr[i][field]] = arr[i];
            }
            for(i in o) {
                r.push(o[i]);
            }
            return r;
        };
    })

    .filter('casino_currency', ['$filter', 'GamesData', function($filter, GamesData) {
        return function(amount, symbol, fractionSize) {
            GamesData
            if (symbol && symbol.toLowerCase().indexOf('btc') == -1) {
                return $filter('currency')(amount, symbol, fractionSize);
            } else {
                return amount + ' ' + symbol;
            }
        };
    }])

    .filter('humanized_currency', ['$filter', 'GamesData', function($filter, GamesData) {
        return function(amount_cents, currency) {
            var current_currency = GamesData.data.currencies[currency],
                amount = amount_cents / current_currency.subunits_to_unit;

            if (currency && currency.toLowerCase().indexOf('btc') == -1) {
                return $filter('currency')(amount, current_currency.symbol);
            } else {
                if (amount < 1 && amount != 0) {
                    currency = 'mBTC';
                    amount = amount_cents / 100000;
                }
                return amount + ' ' + currency;
            }
        };
    }])
;
