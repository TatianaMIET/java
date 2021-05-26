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
        , "text!templates/app/tasks/new-task.html"
    ],

    /**
     * Новое расписание
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
                this.newTask = options.newTask;
            },

            serializeModel: function () {
                return {
                    newTask: this.model.get("newTask").toJSON()
                };
            },

            events: {
                "submit": "onCreateNewTask",
                "click .friends-calendar-btn": "onShowDatePicker"
            },

            onCreateNewTask: function () {
                var form = this.$el.find("form");
                var newTaskData = uiControls.formToJson(form);

                var requestData = {};
                var dataFrom = moment(newTaskData.timeFromDate + newTaskData.timeFrom, 'YYYY-MM-DDHH:mm', true);
                if (dataFrom.isValid()){
                    requestData.timeFrom = dataFrom.format('YYYY-MM-DDTHH:mm:ss');
                }
                var dataTo = moment(newTaskData.timeToDate + newTaskData.timeTo, 'YYYY-MM-DDHH:mm', true);
                if (dataTo.isValid()){
                    requestData.timeTo = dataTo.format('YYYY-MM-DDTHH:mm:ss');
                }
                requestData.description = newTaskData.description;
                $.ajax({
                    type: "POST",
                    url: app.urlPrefix + "/tasks/new-task",
                    data: JSON.stringify(requestData),
                    contentType: "application/json",
                    dataType: "json"
                }).done(function (data) {
                    if (data.resultCode === appData.errors.SUCCESS) {
                        app.tasksRouter.navigate("#tasks", { trigger: true });
                    }
                });

                return false;
            },

            onShow: function () {
                var form = this.$el.find("form");

                form.find("[time-data]").each(function () {
                    var $this = $(this);
                    $this.inputmask({
                        alias: globalize.formatMessage("website.timeFormat").toLowerCase(),
                        placeholder: globalize.formatMessage("website.timePattern")
                    });
                })

                form.find("[data-parsley-date]").each(function () {
                    var $this = $(this);
                    $this.inputmask({
                        alias: globalize.formatMessage("website.dateFormat").toLowerCase(),
                        placeholder: globalize.formatMessage("website.datePattern")
                    });
                    var monthsList = globalize.cldr.main("dates/calendars/gregorian/months/stand-alone");
                    var daysList = globalize.cldr.main("dates/calendars/gregorian/days/stand-alone");
                    var endYear = parseInt($this.attr("data-year-end"));
                    var startYear = parseInt($this.attr("data-year-start"));
                    if (!startYear) {
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
                        onSelect: function (date) {
                            // FIX для IE.
                            setTimeout(function () {
                                var momentDate = moment(date);
                                if (momentDate.isValid()) {
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


        });
        return viewType;
    });