CasinoServices
 .factory('BitcoinConverter', ['$resource', function ($resource) {
     return {
         get: function (callback) {
             callback = callback || function () {
             };
             $.ajax({
                 dataType: "json",
                 url: "https://api.bitcoinaverage.com/ticker/global/USD?r=" + new Date().getTime(),
                 success: callback
             })
         }
     }
 }]);
