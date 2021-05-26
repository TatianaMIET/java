define([
        "underscore"
        , "marionette"
        , "globalize"
        , "moment"
        , "form2js"
        , "zxcvbn"
        , "app/app"
    ],

// Отображение контролов.
    function (
        _
        , marionette
        , globalize
        , moment
        , form2Js
    ) {

        return {

            /**
             * Преобразование данных формы в JSON.
             * @param {Object} form Форма с данными.
             */
            formToJson: function (form) {
                return form2Js(form[0], ".", false, function (node) {
                    var $node = $(node);

                    if ($node.attr("placeholder-value"))
                        return {name: $node.attr("name"), value: $node.attr('placeholder').split(' ', 1)[0]};

                    if ($node.attr("data-parsley-date")) {
                        var value = null;
                        if ($node.attr("data-date-only") === "true") {
                            var date = moment.utc($node.val(), "L");
                            if (date.isValid()) {
                                value = date.format('YYYY-MM-DD');
                            }
                        } else {
                            var date = moment($node.val(), "L");
                            if (date.isValid()) {
                                date.utc();
                                value = date.format();
                            }
                        }
                        return {name: $node.attr("name"), value: value};
                    }
                    if ($node.attr("time-data")) {
                        var time = null;
                            var timeData = moment.utc($node.val(), "HH:mm");
                            if (timeData.isValid()) {
                                time = timeData.format('HH:mm');
                            }
                        return {name: $node.attr("name"), value: time};
                    }
                    if ($node.attr("data-friends-masked")) {
                        return {name: $node.attr("name"), value: $node.inputmask("unmaskedvalue")};
                    }
                    return false;
                });
            }
        }
    });