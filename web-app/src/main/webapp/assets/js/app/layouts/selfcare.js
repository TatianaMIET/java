define([
        "underscore"
        , "backbone"
        , "marionette"
        , "globalize"
        , "moment"
        , "helpers/extensions"
        , "helpers/ui-controls"
        , "helpers/ui-operations"
        , "app/layouts/selfcare-basic"
        , "app/layouts/selfcare-aside"
        , "app/app"
        , "app/app-data"
        , "text!templates/app/layouts/selfcare.html"
    ],

    /**
     * Мастер-страница для аутентифицированного пользователя пользователя.
     */
    function (
        _
        , backbone
        , marionette
        , globalize
        , moment
        , extensions
        , uiControls
        , uiOperations
        , basicLayout
        , layoutWithAside
        , app
        , appData
        , pageTemplate) {

        var viewType = marionette.LayoutView.extend({

            el: "#main-container",

            template: _.template(pageTemplate),

            templateHelpers: function () {
                return {
                    app: app
                    , globalize: globalize
                    , moment: moment
                    , uiControls: uiControls
                }
            },


            events: {
                "click .friends-button-notify": "onShowNotify",
                "click .friends-account-actions-wrapper": "showDialogMenu"
            },

            showDialogMenu: function (event) {
                appData.load("accountContracts")
                    .done(function (model) {
                        app.rootView.dialogRegion.show(new popupDropdownMenuView({
                            model: new backbone.Model({
                                settings: {
                                    url: "test",
                                    header: "test",
                                    property: "test",
                                    validation: "test",
                                },
                                accountContracts: model
                            }),
                            parentModel: ""
                        }));
                        return false;
                    })
                    .fail(function (response) {

                    });

            },


            regions: {

                /**
                 * Основной регион для контента.
                 */
                mainRegion: marionette.Region.extend({
                    el: "#main-content"
                }),

                /**
                 * регион для online chat.
                 */
                /*chatRegion: Marionette.Region.extend({
                    el: "#chat-btn"
                }),
    */
                /**
                 * Регион для модального диалога.
                 */
                dialogRegion: marionette.Region.extend({
                    el: "#dialog-content",

                    onShow: function (view, region, options) {
                        region.$el.one("hidden.modalDialog", function () {
                            view.destroy();
                        });
                        region.$el.modal(_.extend({show: true, create: true}, options));
                    },

                    onBeforeEmpty: function (view) {
                        this.$el.off("hidden.modalDialog");
                        this.$el.modal("hide");
                    }
                }),

                /**
                 * Регион для немодального диалога, прикрепленного снизу.
                 */
                bottomDialogRegion: marionette.Region.extend({
                    el: "#friends-bottom-dialog",

                    onShow: function (view, region, options) {
                        this.$el.closest(".friends-bottom-dialog").show();
                        this.$el.on("resize", _.bind(function () {
                            this.resize();
                        }, this));
                        this.resize();
                    },

                    onBeforeEmpty: function (view) {
                        this.$el.off("resize");
                        this.$el.closest(".friends-bottom-dialog").hide();
                        $(".friends-selfcare-footer").css({"margin-bottom": 0});
                    },

                    resize: function () {
                        var height = this.$el.closest(".friends-bottom-dialog").height();
                        $(".friends-selfcare-footer").css({"margin-bottom": height + "px"});
                    }
                })
            },

            initialize: function () {

                this.listenTo(app.bus, "mainPage", this.pageChanged);

                var body = $("body");
                body.removeClass(function (index, css) {
                    return (css.match(/(^|\s)friends-layout-\S+/g) || []).join(" ");
                });
                body.addClass("friends-layout-selfcare");
            },

            /**
             * Открытие обычного расположения видов.
             * @param {Object} pageInfo Информация об открываемой странице для показа правильного меню.
             */
            showBasicLayout: function (pageInfo) {
                if (pageInfo) {
                    app.bus.trigger("mainPage", pageInfo);
                }

                this.mainRegion.show(new basicLayout());

                return this.mainRegion.currentView.getMainView();
            },



            /**
             * Показ вида в главном регионе.
             * @param {Object} view Вид, который нужно открыть.
             */
            showView: function (view, pageInfo) {
                if (pageInfo) {
                    app.bus.trigger("mainPage", pageInfo);
                }

                this.mainRegion.currentView.showMainView(view);
            },

            pageChanged: function (e) {
                this.$el.find(".friends-selfcare-main-menu nav li").removeClass("friends-menu-selected");
                this.$el.find(".friends-selfcare-main-menu nav li.friends-menu-" + e.pageName).addClass("friends-menu-selected");

                var mainHeader = this.$el.find(".friends-selfcare-header");
                var mainTabsPlace = this.$el.find(".friends-selfcare-main-tabs-wrapper");
                if (e.mainTabs) {
                    mainHeader.addClass("friends-selfcare-show-tabs");
                    mainTabsPlace.html(this.mainTabs({
                        tabs: e.mainTabs,
                        selectedIndex: e.mainTabsSelectedIndex,
                        globalize: globalize
                    }));
                } else {
                    mainTabsPlace.empty();
                    mainHeader.removeClass("friends-selfcare-show-tabs");
                }
            },



            onShowNotify: function () {
                app.notificationsRouter.navigate("notifications/" + new Date().getTime(), {trigger: true});
                return false;
            }
        });

        app.on("before:start", function () {
            if (app.principal) {
                app.rootView = new viewType({app: app});
            }
        });

        return viewType;
    });