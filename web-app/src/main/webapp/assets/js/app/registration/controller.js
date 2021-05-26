define([
        "underscore"
        , "marionette"
        , "uri"
        , "moment"
        , "helpers/extensions"
        , "app/app"
        , "app/registration/views/registration"


    ],

    /**
     * Контроллер страниц регистрации.
     */
    function (
        _
        , marionette
        , uri
        , moment
        , extensions
        , app
        , registrationViewType) {

        var routerType = extensions.AppRouter.extend({
            appRoutes: {
                "registration": "registration"
            }
        });

        var controllerType = marionette.Object.extend({

            registrationData: { regionId: null, email: "", name: "", surname: "", phone: "", birthday: null},

            /**
             * Страница логина.
             */
            registration: function () {
                var view = new registrationViewType({registrationData : this.registrationData});
                app.rootView.mainRegion.show(view);
            },

        });

        app.on("before:start", function (data) {
            if(!data.principal) {
                app.registrationRouter = new routerType({ controller: new controllerType() });
            }
        });
    });