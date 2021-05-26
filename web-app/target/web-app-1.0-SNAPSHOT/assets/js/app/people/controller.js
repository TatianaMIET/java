define([
        "underscore"
        , "backbone"
        , "marionette"
        , "helpers/extensions"
        , "helpers/ui-operations"
        , "app/app"
        , "app/app-data"
        , "app/people/views/people"
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
        , peopleViewType) {

        var routerType = extensions.AppRouter.extend({
            appRoutes: {
                "people": "people"
            }
        });

        var controllerType = marionette.Object.extend({


            people: function () {
                var pageInfo = { pageName: "people", hasSubmenu: false };
                var view = app.rootView.showBasicLayout(pageInfo);

                $.when(appData.load("people"))
                    .done(function(people){
                        var view = new peopleViewType({
                            model: new backbone.Model({
                                people: people
                            })
                        });
                        app.rootView.showView(view, pageInfo);
                    });
            }
        });

        app.on("before:start", function (data) {
            if(data.principal) {
                // Регистрация контроллера только для залогиненного пользователя.
                app.peopleRouter = new routerType({ controller: new controllerType() });
            }
        });
    });