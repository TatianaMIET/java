define([
        "underscore"
        , "backbone"
        , "marionette"
        , "helpers/extensions"
        , "helpers/ui-operations"
        , "app/app"
        , "app/app-data"
        , "app/friends/views/friends"
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
                "friends": "friends"
            }
        });

        var controllerType = marionette.Object.extend({


            friends: function () {
                var pageInfo = { pageName: "friends", hasSubmenu: false };
                var view = app.rootView.showBasicLayout(pageInfo);

                $.when(appData.load("friends"))
                    .done(function(friends){
                        var view = new peopleViewType({
                            model: new backbone.Model({
                                friends: friends
                            })
                        });
                        app.rootView.showView(view, pageInfo);
                    });
            }
        });

        app.on("before:start", function (data) {
            if(data.principal) {
                // Регистрация контроллера только для залогиненного пользователя.
                app.friendsRouter = new routerType({ controller: new controllerType() });
            }
        });
    });