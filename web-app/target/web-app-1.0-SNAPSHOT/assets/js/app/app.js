define([
	  "backbone"
	, "marionette"
	, "globalize"
],

/**
 * Клиентское приложение.
 */
function (
	  backbone
	, marionette
	, globalize) {
		
    var appType = marionette.Application.extend({

    	/**
    	 * События приложения.
    	 */
        bus: _.extend({}, backbone.Events),

        /**
         * Отображение ошибки.
         */
        showError: function() {
            showGenericError();
        }
    });
    
    var app = new appType();
    
    setInterval(function() {
        app.bus.trigger('timer500');
    }, 500);
    setInterval(function() {
        app.bus.trigger('timer1000');
    }, 1000);   
    setInterval(function() {
        app.bus.trigger('timer5000');
    }, 5000);   
    setInterval(function() {
        app.bus.trigger('timer10000');
    }, 10000);     
    setInterval(function() {
        app.bus.trigger('timer30000');
    }, 30000);     

    app.on("start", function () {    
    	$("#main-container").removeClass("friends-loading-spinner");
    	app.rootView.render();
    	backbone.history.start();
    });           

    return app;
});