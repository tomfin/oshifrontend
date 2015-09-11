CasinoDirectives
    .directive('scrollUp', function() {
    return {
        link: function(scope, element, attrs) {
            var divPosition = $(attrs.sRef).offset();
            element.bind('click', function() {
                console.log (divPosition);
                $('html, body').animate({
                    scrollTop: divPosition.top
                }, "fast");

            });
        }
    };
});
