define([
	  "underscore"
    , "marionette"
    , "globalize"
    , "helpers/ui-controls"
    , "helpers/ui-operations"
    , "app/app"
    , "text!templates/app/layouts/loading.html"
],

/**
 * Вид для отображения прогресса загрузки и ошибок.
 */
function (
	_
	, marionette
	, globalize
	, uiControls
	, uiOperations
	, app
	, pageTemplate) {

    var viewType = marionette.ItemView.extend({
    	
    	template: _.template(pageTemplate),
        
        templateHelpers: function () {
            return {
            	  app: app
            	, globalize: globalize
            	, uiControls: uiControls
            	, isArticle: this.isArticle
            }
        },        
        
        initialize: function(options) {
        	this.isArticle = options.isArticle;
        },
        
        onShow: function() {        	
        },
        
        onBeforeDestroy: function() {        	
        },      
        
        /**
         * Отображение ошибки загрузки.
         * @param {Object} error Описание ошибки.
         */
        showError: function(error) {        	
        	this.$el.find("#loading-message").hide();
        	var errorPlace = this.$el.find("#error-message");
        	errorPlace.find("#error-message-server").html(error.resultText);
        	errorPlace.show();
        }
    });

    return viewType;
});