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
        , "text!templates/app/meeting/meetings.html"
    ],

    /**
     * Список всех встреч.
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

            initialize: function (options) {
            },

            serializeModel : function() {
                return {
                    meetings : this.model.get("meetings").toJSON()
                };
            },

            events: {
            },

            onShow: function () {
            },

        });
        return viewType;
    });