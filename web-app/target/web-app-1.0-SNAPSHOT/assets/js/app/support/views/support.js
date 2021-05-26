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
        , "app/support/views/map"
        , "text!templates/app/support/support.html"
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
        , mapView
        , pageTemplate) {

        var viewType = marionette.LayoutView.extend({

            template: _.template(pageTemplate),

            templateHelpers: function () {
                return {
                    app: app
                    , globalize: globalize
                    , uiControls: uiControls
                    , moment: moment
                    , processDetails: this.processDetails
                    , processThemes: this.processThemes
                    , officesInfo: this.officesInfo
                }
            },

            initialize: function(options) {
                this.processDetails = options.model.get("processDetails").get("processes");
                this.processThemes = options.model.get("processDetails").get("themes");
                this.officesInfo = options.model.get("officesInfo").get("offices");
                this.file = {};
            },

            events: {
                "submit #create-process": "createProcess",
                "click #uploadFile": "showFileExplorer",
                "click #deleteFile": "deleteFile",
                "change #inputFileContent": "uploadFile",
                "click #show-map": "onShowMap"
            },

            regions: {
                mapRegion: '#requests-map'
            },

            onShow: function () {
                // var formBonus = this.$el.find("#create-process form");


                $("select[name=subthemeId]", this.$el).select2({
                    width: '100%',
                    minimumResultsForSearch: -1,
                    templateResult: function(item) {
                        return $("<span>" + item.text + "</span>");
                    },
                    "language": {
                        "noResults": function() {
                            return "";
                        }
                    },
                });
            },

            onShowMap: function(e) {

                var map = this.mapRegion.$el;
                var list =this.$el.find("#list-of-offices");

                var view = new mapView({
                    model: new backbone.Model({
                        officesInfo:this.officesInfo
                    })
                });

                if (! map.is(':visible')) {
                    this.mapRegion.empty();
                    this.mapRegion.show(view);
                    list.hide();
                    map.show();
                   $('#show-map').html(globalize.formatMessage("website.showList") );
                } else {
                    map.hide();
                    list.show();
                   $('#show-map').html(globalize.formatMessage("website.showMap") );
                }
                return false;
            },


            showFileExplorer: function(){
                this.$el.find("#inputFileContent").trigger("click");
            },

            deleteFile: function(){
                let arrayFile = this.$el.find("#inputFileContent")[0];
                arrayFile.value = "";
                this.file = {};
                this.$el.find("#uploadFile").show();
                this.$el.find("#deleteFile").hide();
                this.$el.find("#file-name").empty();
            },

            uploadFile: function(){
                // Показ крутилки.
                let correctedView = this.$el;

                uiOperations.startRequest(this.$el);
                let files = this.$el.find("#inputFileContent")[0].files;

                var that = this;
                let length = files.length;

                for(let index = 0; index < length; index++) {
                    console.log("(files[index].type ",files[index].type);
                    if (
                        files[index].type === "image/jpeg"
                        || files[index].type === "image/png"
                        || files[index].type === "application/msword"                                                   //doc
                        || files[index].type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"    // xlsx
                        || files[index].type === "vnd.openxmlformats-officedocument.wordprocessingml.document"          //docx
                    ) {
                        var reader = new FileReader();
                        this.file.fileName = files[index].name;
                        this.file.fileMimeType = files[index].type;

                        this.$el.find("#file-name").append(files[index].name);


                        reader.readAsDataURL(files[index]);

                        reader.onload = function () {

                            let base64 = reader.result.split(',')[1];
                            that.file.fileContent = base64;

                            if (index === length-1){
                                let dataOrjqXHR = {statusText:"success"};
                                uiOperations.completeRequest(that.$el, dataOrjqXHR);
                            }
                            that.$el.find("#uploadFile").hide();
                            that.$el.find("#deleteFile").show();
                        };
                        reader.onerror = function (error) {
                            app.rootView.dialogRegion.show(new extensions.AlertDialog({
                                header: appData.getErrorMessage()
                            }));
                        };

                    } else {
                        let dataOrjqXHR = {statusText:"success"};
                        uiOperations.completeRequest(that.$el, dataOrjqXHR);
                        app.rootView.dialogRegion.show(new extensions.AlertDialog({
                            header: "Ошибка",
                            text: "Вы можете загрузить файл только с расширением: jpg, png, doc, xls"
                        }));
                    }
                }

            },
            /**
             * Отправка обращения пользователя.
             */
            createProcess: function () {
                var form = this.$el.find("#create-process form");
                var pointsData = uiControls.formToJson(form);
                pointsData.fileName = this.file.fileName;
                pointsData.fileMimeType = this.file.fileMimeType;
                pointsData.fileContent = this.file.fileContent;

                var self = this;

                var isValid = form.parsley().validate();
                console.log("isValid: ",isValid);

                if (!isValid){
                    console.log("isValid: ",isValid);
                    return;
                }
                appData.postForm(
                    form,
                    "/api/v1/create-process",
                    pointsData)
                    .done(_.bind(function (data, textStatus, jqXHR) {

                        if (data.resultCode === appData.errors.SUCCESS) {

                            app.rootView.dialogRegion.show(new extensions.AlertDialog({
                                header: globalize.formatMessage("website.requestConfirmed"),
                                onCloseCallback: _.bind(self.clearingTheForm, self)
                            }));

                        } else {
                            app.rootView.dialogRegion.show(new extensions.AlertDialog({
                                header: appData.getErrorMessage(data.resultText)
                            }));
                        }

                    }, this))
                    .fail(function (response) {
                        console.log("response: ",response);
                        if (response.status === 422) return;
                        app.rootView.dialogRegion.show(new extensions.AlertDialog({
                            header: appData.getErrorMessage(response)
                        }));
                    });

                return false;
            },

            /**
             * Очистка форм обращения
             */
            clearingTheForm: function () {
                this.$el.find("textarea[name=comment]").val("");
                this.$el.find("select[name=subthemeId]").prop('selectedIndex', 0).change();
                this.deleteFile();
            }
        });
        return viewType;
    });