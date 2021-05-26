define([
        "underscore"
        , "marionette"
        , "globalize"
        , "cocktail"
        , "jsCookie"
        , "helpers/ui-controls"
        , "helpers/ui-operations"
        , "app/app"
        , "app/app-data"
        , "text!templates/app/login/login.html"
    ],

    /**
     * Страница аутентификации.
     */
    function (
        _
        , marionette
        , globalize
        , cocktail
        , jsCookie
        , uiControls
        , uiOperations
        , app
        , appData
        , pageTemplate) {

        var viewType = marionette.ItemView.extend({

            viewName: "login",

            template: _.template(pageTemplate),

            templateHelpers: function () {
                return {
                    app: app
                    , globalize: globalize
                    , uiControls: uiControls
                    , accountNumber: this.loginData.accountNumber
                }
            },

            initialize: function (options) {
                this.loginData = options.loginData;
            },

            events: {
                "submit": "onLogin"
            },

            onShow: function () {
            },

            onBeforeDestroy: function () {
                var form = this.$el.find("form");
                var loginData = uiControls.formToJson(form);

                // Сохраняем введенные данные для использования на других экранах.
                this.loginData.accountNumber = loginData.accountNumber;
                this.loginData.password = loginData.password;
            },

            /**
             * Аутентификация.
             */
            onLogin: function () {
                var form = this.$el.find("form");
                var loginData = uiControls.formToJson(form);

                var self = this;

                uiOperations.startRequest(form);

                appData.postForm(form, "/home/login", loginData)
                    .done(_.bind(function (data) {
                        if (data.resultCode == appData.errors.SUCCESS) {
                            // Успех.
                            uiOperations.openUrl(this.loginData.returnUrl);
                        } else if (data.resultCode == appData.errors.AUTHENTICATION_FAILED) {

                        } else {
                            // Общая проблема.
                            // appData.processResultError(form, data);
                        }
                    }, this));
                return false;
            }
        });

        return viewType;
    });