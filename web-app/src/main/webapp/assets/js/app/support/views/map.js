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
        , "text!templates/app/support/map.html"
    ],
// Вид карты.
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

        var viewType = marionette.ItemView.extend({

            template: _.template(pageTemplate),

            templateHelpers: function () {
                return {
                    app: app,
                    globalize: globalize
                    , uiControls: uiControls
                    , moment: moment
                }
            },

            initialize: function (options) {
                this.officesInfo = options.model.get("officesInfo");
            },

            onShow: function () {
                var view = this;

                ymaps.ready(
                    init(view)); // Ожидание загрузки API с сервера Яндекса

                function init(view) {

                    //координаты ближайщего офиса
                    var coords = [view.officesInfo[0].latitude, view.officesInfo[0].longitude];

                    view.requestsMap = new ymaps.Map("YMapsID", {
                            center: coords,
                            zoom: 13,
                            controls: []
                        }, {
                            suppressMapOpenBlock: true
                        }
                    );

                    view.requestsMap.behaviors.disable('scrollZoom');

                    view.requestsMap.controls.add("zoomControl", {
                        position: {top: 15, left: 15}
                    });
                    view.requestsMap.events.add('click', function() {
                        view.requestsMap.balloon.close();
                    });


                    // Создание макета содержимого балуна.
                    var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                        ' <div class="header-map">' + globalize.formatMessage("website.supportOfficesAddrColumn") + '</div>' +
                        ' <div class="body-map">{{properties.address}}</div>' +
                        ' <div class="header-map">' + globalize.formatMessage("website.supportOfficesOpenedHoursColumn") + '</div>' +
                        ' <div class="body-map">{{properties.serviceHours}}</div>'+
                        '<img class="close-balloon" id="close-balloon" src="' + app.urlPrefix + '/assets/img/icon-close.svg">'
                        , {
                            build: function () {
                                BalloonContentLayout.superclass.build.call(this);
                                $('#close-balloon').bind('click', this.onClick);
                            },
                            clear: function () {
                                $('#close-balloon').unbind('click', this.onClick);
                                BalloonContentLayout.superclass.clear.call(this);
                            },
                            onClick: function () {
                                view.requestsMap.balloon.close();
                            }
                        });


                    // Создаём макет метки.
                    var MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                        '<div style="color: #FFFFFF; font-weight: bold;">' +
                        '<img src="{{= app.urlPrefix}}/assets/img/logo.png"' +
                        'srcset="{{= app.urlPrefix}}/assets/img/logo@2x.png 2x,' +
                        '{{= app.urlPrefix}}/assets/img/logo@3x.png 3x"></div>'
                    );


                    _.each(view.officesInfo, function (office, index) {

                        var myPlacemarkWithContent = new ymaps.Placemark([office.latitude, office.longitude], {
                                address: office.address,
                                serviceHours: office.serviceHours
                            },
                            {
                                // Опции.
                                // Задаем макет метки - пользовательская картинка с контентом
                                iconLayout: 'default#imageWithContent',
                                // Картинка метки
                                iconImageHref: app.urlPrefix + '/assets/img/bubble-bg.png',
                                // Размеры метки
                                iconImageSize: [120, 58],
                                // Смещение левого верхнего угла иконки относительно
                                // её "ножки" (точки привязки)
                                iconImageOffset: [-60, -58],
                                // Смещение слоя с содержимым относительно слоя с картинкой
                                iconContentOffset: [17, 12],
                                // Макет содержимого.
                                iconContentLayout: MyIconContentLayout,

                                balloonContentLayout: BalloonContentLayout,
                                // Задаем макет балуна - пользовательская картинка с контентом
                                balloonLayout: "default#imageWithContent",
                                // Картинка балуна
                                balloonImageHref: app.urlPrefix + '/assets/img/rectangle.png',
                                // Размеры картинки балуна
                                balloonImageSize: [350, 175],
                                // Смещение картинки балуна
                                balloonImageOffset: [-175, -175],
                                // Размеры содержимого балуна
                                balloonContentSize: [310, 135],
                                // Смещение слоя с содержимым относительно слоя с картинкой
                                balloonContentOffset: [20, 20],
                                // Балун не имеет тени
                                balloonShadow: false
                            });
                        view.requestsMap.geoObjects.add(myPlacemarkWithContent);
                    });
                }
            }
        });

        return viewType;
    });