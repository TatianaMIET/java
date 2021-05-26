define([
        "underscore"
        , "backbone"
        , "marionette"
        , "helpers/extensions"
        , "helpers/ui-operations"
        , "app/app"
        , "app/app-data"
        , "app/meeting/views/meetings"
        , "app/meeting/views/new-meeting"
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
        , meetingViewType
        , newMeetingViewType) {

        var routerType = extensions.AppRouter.extend({
            appRoutes: {
                "meetings" : "getAllMeetings"
                , "meetings/new-meeting": "createNewMeeting"
            }
        });

        var controllerType = marionette.Object.extend({

            getAllMeetings: function(){

                var pageInfo = { pageName: "meeting", hasSubmenu: false };
                var view = app.rootView.showBasicLayout(pageInfo);

                $.when(appData.load("meetings"))
                    .done(function(meetings){
                        var view = new meetingViewType({
                            model: new backbone.Model({
                                meetings: meetings
                            })
                        });
                        app.rootView.showView(view, pageInfo);
                    });
            },

            createNewMeeting: function () {

                var pageInfo = { pageName: "meeting", hasSubmenu: false };
                var view = app.rootView.showBasicLayout(pageInfo);

                $.when(appData.load("onlyFriends"))
                    .done(function(onlyFriends){
                        var view = new newMeetingViewType({
                            model: new backbone.Model({
                                friendsList: onlyFriends
                            })
                        });
                        app.rootView.showView(view, pageInfo);
                    });
            }
        });

        app.on("before:start", function (data) {
            if(data.principal) {
                // Регистрация контроллера только для залогиненного пользователя.
                app.meetingRouter = new routerType({ controller: new controllerType() });
            }
        });
    });