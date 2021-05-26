define([
	  "underscore"
    , "marionette"
    , "globalize"
    , "helpers/ui-controls"
    , "helpers/ui-operations"
    , "app/app"
    , "app/layouts/loading"
    , "text!templates/app/layouts/selfcare-basic.html"
],

/**
 * Расположение видов в обычной вкладке.
 */
function (
	_
	, marionette
	, globalize
	, uiControls
	, uiOperations
	, app
	, LoadingView
	, pageTemplate) {
	
    var viewType = marionette.LayoutView.extend({
                
        template: _.template(pageTemplate),
        
        templateHelpers: function () {
            return {
                  globalize: globalize
                , uiControls: uiControls
            }
        },
        
        regions: {
            pageRegion: Marionette.Region.extend({
                el: "#page-content"
            })
        },
        
        initialize: function() {
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