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
        , "text!templates/app/meeting/new-meeting.html"
    ],

    /**
     * Новая встреча.
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
                this.friendsCheckList = [];
            },

            serializeModel : function() {
                return {
                    friendsList : this.model.get("friendsList").toJSON()
                };
            },

            events: {
                "click .check": "addFFriendForMeeting",
                "click .friends-calendar-btn": "onShowDatePicker",
                "submit" : "createNewMeeting"
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

            addFFriendForMeeting: function (e) {
                var id = $(e.target).attr("id");

                if ($(e.target).prop("checked")){
                    this.friendsCheckList.push(id);
                } else{
                    for (var i = 0; i < this.friendsCheckList.length; i++) {
                        if (this.friendsCheckList[i] === id){
                            this.friendsCheckList.splice(i, 1);
                        }
                    }
                }
            },

            createNewMeeting: function(){

                var form = this.$el.find("form");
                var newMeetingData = uiControls.formToJson(form);

                var requestData = {};
                var dataFrom = moment(newMeetingData.timeFromDate + newMeetingData.timeFrom, 'YYYY-MM-DDHH:mm', true);
                if (dataFrom.isValid()){
                    requestData.timeFrom = dataFrom.format('YYYY-MM-DDTHH:mm:ss');
                }
                var dataTo = moment(newMeetingData.timeToDate + newMeetingData.timeTo, 'YYYY-MM-DDHH:mm', true);
                if (dataTo.isValid()){
                    requestData.timeTo = dataTo.format('YYYY-MM-DDTHH:mm:ss');
                }
                requestData.description = newMeetingData.description;
                requestData.friends = this.friendsCheckList;

                $.ajax({
                    type: "POST",
                    url: app.urlPrefix + "/meeting/create-new-meeting",
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



        });
        return viewType;
    });