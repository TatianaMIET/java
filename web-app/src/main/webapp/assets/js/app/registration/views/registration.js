define([
        "underscore"
        , "marionette"
        , "globalize"
        , "cocktail"
        , "jsCookie"
        , "moment"
        , "helpers/ui-controls"
        , "helpers/ui-operations"
        , "app/app"
        , "app/app-data"
        , "text!templates/app/registration/registration.html"
    ],

    /**
     * Страница регистрации.
     */
    function (
        _
        , marionette
        , globalize
        , cocktail
        , jsCookie
        , moment
        , uiControls
        , uiOperations
        , app
        , appData
        , pageTemplate) {

        var viewType = marionette.ItemView.extend({

            viewName: "registration",

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
                this.registrationData = options.registrationData;
            },

            events: {
                "submit": "onRegistration",
                "click .friends-calendar-btn": "onShowDatePicker"
            },

            onShow: function () {
                var form = this.$el.find("form");
                form.find("[data-parsley-date]").each(function() {
                    var $this = $(this);
                    $this.inputmask({
                        alias: globalize.formatMessage("website.dateFormat").toLowerCase(),
                        placeholder: globalize.formatMessage("website.datePattern")
                    });
                    var monthsList = globalize.cldr.main("dates/calendars/gregorian/months/stand-alone");
                    var daysList = globalize.cldr.main("dates/calendars/gregorian/days/stand-alone");
                    var endYear = parseInt($this.attr("data-year-end"));
                    var startYear = parseInt($this.attr("data-year-start"));
                    if(!startYear) {
                        startYear = endYear - 100;
                    }
                    $this.pikaday({
                        yearRange: [startYear, endYear],
                        i18n: {
                            previousMonth: "",
                            nextMonth: "",
                            months: _.toArray(monthsList.wide),
                            weekdays: _.toArray(daysList.wide),
                            weekdaysShort: _.toArray(daysList.short)
                        },
                        format: "L",
                        onSelect: function(date) {
                            // FIX для IE.
                            setTimeout(function() {
                                var momentDate = moment(date);
                                if(momentDate.isValid()) {
                                    $this.val(momentDate.format("L"));
                                }
                                $this.parsley().validate();
                            }, 20);
                        }
                    });
                });
            },

            /**
             * Показ диалога выбора даты.
             */
            onShowDatePicker: function (e) {
                $(e.currentTarget).closest(".date-wrapper").find("input").pikaday("show");
            },

            /**
             * Регистрация.
             */
            onRegistration: function () {
                var form = this.$el.find("form");
                var registrationData = uiControls.formToJson(form);


                appData.postForm(form, "/registration", registrationData)
                    .done(_.bind(function (data) {
                        if (data.resultCode === appData.errors.SUCCESS) {
                            // Успех.
                            console.log(data);
                            uiOperations.openUrl(this.registrationData.returnUrl);
                        } else {
                            // Общая проблема.
                            console.log(data);
                        }
                    }, this));
                return false;
            }
        });

        return viewType;
    });