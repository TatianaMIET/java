define([    
	  "underscore"
    , "backbone"
    , "marionette"
    , "globalize"
	, "helpers/ui-controls"
    , "app/app"
	, "app/app-data"
    , "text!templates/helpers/views/alert-dialog.html" 
    , "text!templates/helpers/views/confirm-dialog.html"
],

// Расширение библиотечных объектов.
function (
	_
	, backbone
	, marionette
	, globalize
	, uiControls
	, app
	, appData
	, alertViewTemplate
	, confirmViewTemplate
) {

	var inputEvents = ["propertychange", "change", /*"click", "keyup",*/ "input", "cut", "paste"];
	
	return {
		
		AppRouter: marionette.AppRouter.extend({
			
			route: function(route, name, callback) {
		        var router = this;
		        if (_.isFunction(name)) {
		            callback = name;
		            name = '';
		        }
		        if (!callback) {
		        	callback = this[name];
		        } 

		        var newCallback = function() {
		        	app.bus.trigger("route:before", route);
		        	app.bus.trigger("route:before:" + route);
		            
		            callback.apply(router, arguments);
		        };
		        return marionette.AppRouter.prototype.route.call(this, route, name, newCallback);
		    }			
		}),
		
		Model: backbone.Model.extend({
			
	    	save: function(attributes, options) {
	    		this.resultCode = 0;
	    		this.resultText = "";
	    		
	    		return backbone.Model.prototype.save.call(attributes, options);
	    	},
	    	
	    	parse: function(response, options) {    		
	    		if(!_.isUndefined(response.resultCode)) {
	    			this.resultCode = response.resultCode;
	    			delete response.resultCode;	
	    		}
	    		if(!_.isUndefined(response.resultText)) {
	    			this.resultText = response.resultText;
	    			delete response.resultText;	
	    		}
	    		
	    		return backbone.Model.prototype.parse.call(response, options);
	    	} 			
		}),
				
		/**
		 * Диалог для отображения сообщения.
		 */
	    AlertDialog: marionette.ItemView.extend({
	    	
	        template: _.template(alertViewTemplate),

	        templateHelpers: function () {
	            return {
	            	  app: app
	            	, globalize: globalize
	            	, text: this.text
	            	, header: this.header
	            	, buttonLabel: this.buttonLabel || null
	            }
	        },
	                
	        initialize: function(options) {
	        	this.header = options.header;
	        	this.text = options.text;
	        	this.buttonLabel = options.buttonLabel;
				this.onCloseCallback = options.onCloseCallback;
	        },

			events: {
			 "click .button-primary.close" : "onClose"
			},

			onClose: function() {
	        	if(this.onCloseCallback)
					this.onCloseCallback();
	        	this.destroy();
	        }
	    }),
	    
	    /**
	     * Диалог подтверждения операции.
	     */
	    ConfirmDialog: marionette.ItemView.extend({
	    	
	        template: _.template(confirmViewTemplate),

	        templateHelpers: function () {
	            return {
	            	  app: app
	            	, globalize: globalize
	            	, text: this.text
	            }
	        },
	                
	        initialize: function(options) {
	        	this.text = options.text;
	        	this.onOkCallback = options.onOk;
	        },
	        
	        events: {
	            "click .button-primary": "onSuccess"
	        },

	        onSuccess: function() {
	        	this.destroy();
	        	this.onOkCallback();
	        	
	        	return false;
	        }
	    }),

		/**
		 * Добавление в вид событий, который прослушивают изменение текста в поле ввода.  
		 * @param {Object} viewType Тип вида, в котором будут слушаться события.
		 * @param {String} inputSelector Selector jQuery, который выберет поля ввода.
		 * @param {String} handlerName Имя обработчика поля ввода.
		 */
		listenToInputChange: function(viewType, inputSelector, handlerName) {
			_.each(inputEvents, function(item) {
				var events = viewType.events;
				if(!events) {
					var events = viewType.prototype.events;
				}
				events[item + " " + inputSelector] = handlerName;
			});
		}
	};
});