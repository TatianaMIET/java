define([
        "underscore"
        , "backbone"
        , "marionette"
        , "helpers/extensions"
        , "helpers/ui-operations"
        , "app/app"
        , "app/app-data"
        , "app/profile/views/profile"
    ],

    /**
     * Контроллер страниц.
     */
    function (
        _
        , backbone
        , marionette
        , extensions
        , uiOperations
        , app
        , appData
        , profileViewType) {

        var routerType = extensions.AppRouter.extend({
            appRoutes: {
                "": "profile"
            }
        });

        var controllerType = marionette.Object.extend({


            profile: function () {
                var pageInfo = { pageName: "profile", hasSubmenu: false };
                var view = app.rootView.showBasicLayout(pageInfo);

                $.when(appData.load("profile"))
                    .done(function (profile) {
                        var view = new profileViewType({
                            model: new backbone.Model({
                                profile: profile
                            })
                        });
                        app.rootView.showView(view, pageInfo);
                    })
                    .fail(function (response) {
                        view.showError({resultText: appData.getErrorMessage(response)});
                    });
            }
        });

        app.on("before:start", function (data) {
            if(data.principal) {
                // Регистрация контроллера только для залогиненного пользователя.
                app.profileRouter = new routerType({ controller: new controllerType() });
            }
        });
    });