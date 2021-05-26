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
        , "text!templates/app/people/people.html"
    ],

    /**
     * Профиль.
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
                this.listenTo(this.model.get("people"), "change", this.render);
            },

            serializeModel : function() {
                return {
                    people : this.model.get("people").toJSON()
                };
            },

            events: {
                "click .make-friends": "makeFriends"
            },

            onShow: function () {
            },

            makeFriends: function (e) {
                var friendId = $(e.target).val();

                $.post(app.urlPrefix + "/friends/make-friends", friendId)
                    .done(function (data) {
                        if (data.resultCode === appData.errors.SUCCESS) {
                            appData.update("people");
                            appData.update("friends");
                        }
                    });
            }
        });
        return viewType;
    });