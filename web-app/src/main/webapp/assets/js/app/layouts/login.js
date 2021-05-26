define([
	  "underscore"
    , "marionette"
    , "globalize"
    , "helpers/ui-controls"
    , "helpers/ui-operations"
    , "app/app"
    , "text!templates/app/layouts/login.html"
],

/**
 * Мастер-страница для диалогов логина.
 */
function (
	_
	, marionette
	, globalize
	, uiControls
	, uiOperations
	, app
	, pageTemplate) {
	
    var viewType = marionette.LayoutView.extend({

        el: "#main-container",
         

        template: _.template(pageTemplate),
        
        templateHelpers: function () {
            return {
            	  app: app
            	, globalize: globalize
            	, uiControls: uiControls
            }
        },        

        regions: {
            mainRegion: Marionette.Region.extend({
                el: "#main-content"
            })
        },
        
        initialize: function() {       	
        	var body = $("body");
        	body.removeClass(function (index, css) {
        	    return (css.match(/(^|\s)friends-layout-\S+/g) || []).join(" ");
        	});        	
        	body.addClass("friends-layout-login");
        }
    });
    
    app.on("before:start", function () {
    	if(!app.principal) {
    		app.rootView = new viewType({ app: app });
    	}
    });

    return viewType;
});