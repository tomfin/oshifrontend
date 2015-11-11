CasinoServices
    .factory('Autoscroll', [function () {
        var is_autoscroll = false;
        return {
            check: function (state) {
                var res = false;
                if (is_autoscroll) {
                    res = true;
                } else {
                    setTimeout(function(){
                        is_autoscroll = true;
                    }, 1000);
                }

                return res;
            }
        }
    }])
;
