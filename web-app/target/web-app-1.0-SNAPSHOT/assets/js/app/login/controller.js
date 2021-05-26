define([
	  "underscore"
    , "marionette"
    , "uri"
    , "helpers/extensions"
    , "app/app"
    , "app/login/views/login"


],

/**
 * Контроллер страниц аутентификации.
 */ 
function (
	_
	, marionette
	, uri
	, extensions
	, app
	, loginViewType) {
	
    var routerType = extensions.AppRouter.extend({
        appRoutes: {
              "": "login"
            , "*notFound": "redirectToLogin"
        }
    });	

    var controllerType = marionette.Object.extend({
    	
    	loginData: { regionId: null, login: "", accountNumber: null, phone: "", account: null },
    	    	
        /**
         * Страница логина.
         */ 
        login: function () {        	
            var view = new loginViewType({loginData : this.loginData});
            app.rootView.mainRegion.show(view);        	            
        },       

        /**
         *  перевод на стартовую страницу.
         */
        redirectToLogin: function() {
    		this.loginData.returnUrl = uri(window.location.toString()).resource();	
        	app.loginRouter.navigate("", {trigger: true});
        }
    });

    app.on("before:start", function (data) {
    	if(!data.principal) {
    		app.loginRouter = new routerType({ controller: new controllerType() });	
    	}
    });
});