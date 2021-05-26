define([
        "underscore"
        , "backbone"
        , "marionette"
        , "globalize"
        , "moment"
        , "helpers/ui-controls"
        , "helpers/ui-operations"
        , "helpers/extensions"
        , "app/app"
        , "app/app-data"
        , "text!templates/app/tasks/tasks.html"
    ],

    /**
     * Расписание пользователя
     */
    function (
        _
        , backbone
        , marionette
        , globalize
        , moment
        , uiControls
        , uiOperations
        , extensions
        , app
        , appData
        , pageTemplate) {

        var viewType = marionette.LayoutView.extend({

            template: _.template(pageTemplate),

            templateHelpers: function () {
                return {
                    app: app
                    , globalize: globalize
                    , uiControls: uiControls
                    , moment: moment
                }
            },

            initialize: function () {
                this.listenTo(this.model.get("allTasks"), "change", this.render);
            },

            serializeModel : function() {
                return {
                    allTasks : this.model.get("allTasks").toJSON()
                };
            },

            events: {

            },

            onShow: function () {
            }


        });
        return viewType;
    });