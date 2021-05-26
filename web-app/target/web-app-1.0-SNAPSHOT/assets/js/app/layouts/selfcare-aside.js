define([
	  "underscore"
	, "backbone"
    , "marionette"
    , "globalize"
    , "helpers/ui-controls"
    , "helpers/ui-operations"
    , "app/app"
    , "app/app-data"
    , "app/layouts/loading"
    , "text!templates/app/layouts/selfcare-aside.html"
],

/**
 * Составная страница личного кабинета с основным и дополнительным контентом.
 */
function (
	_
	, backbone
	, marionette
	, globalize
	, uiControls
	, uiOperations
	, app
	, appData
	, LoadingView
	, pageTemplate) {
	
	var asideRegion = marionette.Region.extend({
    	
		onShow: function(view, region, options) {
			region.$el.show();
		},
		
		onBeforeEmpty: function(view) {
			this.$el.hide();
		}            	
    });
	
    var viewType = marionette.LayoutView.extend({
                
        template: _.template(pageTemplate),
        
        templateHelpers: function () {
            return {
                  globalize: globalize
                , uiControls: uiControls
                , app: app
            }
        },
        
        regions: {
        	pageRegion: "#page-content",
            	
            balanceRegion: asideRegion.extend({
            	el: "#balance-place",
            })
        },
        
        initialize: function(options) {
        	this.asides = options.asides;
        },
                
        /**
         * Возвращает вид из главного региона.
         * @return {Object} Вид в главном регионе.
         */
        getMainView: function() {
        	return this.pageRegion.currentView;
        },
        
        /**
         * Отображает вид в главном регионе.
         * @param {Object} view Вид, который нужно открыть в главном регионе.
         */
        showMainView: function(view) {       	
        	this.pageRegion.show(view);
        },
        
        onShow: function() {
        	this.pageRegion.show(new LoadingView());
        }
    });

    return viewType;
});