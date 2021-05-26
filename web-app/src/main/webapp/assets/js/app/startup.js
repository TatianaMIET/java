define([
        "globalize"
        , "app/app"
        , "app/layouts/login"
        , "app/layouts/selfcare"
        , "app/profile/controller"
        , "app/login/controller"
        , "app/support/controller"
        , "app/registration/controller"
        , "app/people/controller"
        , "app/friends/controller"
        , "app/tasks/controller"
        , "app/meeting/controller"
    ],

    /**
     * Запуск клиентского приложения.
     */
    function (
        globalize
        , app) {

        return {
            start: function (globalSettings) {
                _.extend(app, globalSettings);

                // Перед запуском загружаем дополнительные данные для приложения.
                var staticDataLoaded = $.get(app.urlPrefix + "/api/v1/get-static-resource/" + app.currentLanguage);
                var dynamicDataLoaded = $.get(app.urlPrefix + "/api/v1/dynamic-data");

                $.when(staticDataLoaded, dynamicDataLoaded)
                    .done(function (staticData, dynamicData) {
                        _.extend(app, staticData[0]);
                        _.extend(app, dynamicData[0]);

                        globalize.loadMessages(app.strings);
                        app.start(app);

                    })
            }
        }
    });