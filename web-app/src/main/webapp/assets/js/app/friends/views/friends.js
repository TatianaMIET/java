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
        , "text!templates/app/friends/friends.html"
    ],

    /**
     * Страниица с друзьями.
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
                this.listenTo(this.model.get("friends"), "change", this.render);
                this.listenTo(app.bus, "timer10000", this.updateFriends);
            },

            serializeModel: function () {
                return {
                    friends: this.model.get("friends").toJSON()
                };
            },

            events: {
                "click .set-status": "setStatus"
            },

            setStatus: function (e) {

                var friendId = $(e.target)[0].getAttribute("value-id");
                var status = $(e.target).val();

                $.post(app.urlPrefix + "/friends/set-new-status/" + status, friendId)
                    .done(function (data) {
                        if (data.resultCode === appData.errors.SUCCESS) {
                            appData.update("friends");
                            appData.update("people");
                        }
                    });


            },

            updateFriends: function () {
                appData.update("friends");
            },

            onShow: function () {
            },

        });
        return viewType;
    });