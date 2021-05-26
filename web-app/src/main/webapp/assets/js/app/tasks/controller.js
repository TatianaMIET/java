define([
        "underscore"
        , "backbone"
        , "marionette"
        , "helpers/extensions"
        , "helpers/ui-operations"
        , "app/app"
        , "app/app-data"
        , "app/tasks/views/tasks"
        , "app/tasks/views/new-task"
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
        , tasksViewType
        , newTaskType
    ) {

        var routerType = extensions.AppRouter.extend({
            appRoutes: {
                "tasks": "showAllTasks"
                , "tasks/new-task": "newTask"
            }
        });

        var controllerType = marionette.Object.extend({

            /**
             * Список всех дел.
             */
            showAllTasks: function () {
                var pageInfo = {pageName: "tasks", hasSubmenu: false};
                var view = app.rootView.showBasicLayout(pageInfo);

                $.when(appData.load("tasks"))
                    .done(function (tasks) {
                        var view = new tasksViewType({
                            model: new backbone.Model({
                                allTasks: tasks
                            })
                        });
                        app.rootView.showView(view, pageInfo);
                    });
            },


            newTaskData: {timeFromDate: null, timeFrom: null, timeToDate: null, timeTo: null, description: ""},

            /**
             * Страница заполнения нового расписания.
             */
            newTask: function () {
                var view = new newTaskType({newTask: this.newTaskData});
                app.rootView.mainRegion.show(view);
            },


        });

        app.on("before:start", function (data) {
            if (data.principal) {
                // Регистрация контроллера только для залогиненного пользователя.
                app.tasksRouter = new routerType({controller: new controllerType()});
            }
        });
    });