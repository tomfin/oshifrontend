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

    .filter('casino_currency', ['$filter', function($filter) {
        return function(amount, symbol, fractionSize) {
            if (symbol.toLowerCase().indexOf('btc') == -1) {
                return $filter('currency')(amount, symbol, fractionSize);
            } else {
                return amount + ' ' + symbol;
            }
        };
    }])
;