define([
	  "underscore"
	, "backbone"
    , "marionette"
    , "helpers/extensions"
    , "helpers/ui-operations"
    , "app/app"
    , "app/app-data"    
    , "app/support/views/support"
],

/**
 * Контроллер страниц.
 */
function (
	_
	, backbone
	, marionette
	, extensions
	, uiOperations
	, app
	, appData	
	, supportViewType) {
	
    var routerType = extensions.AppRouter.extend({
        appRoutes: {
              "support": "support"
        }
    });	

    var controllerType = marionette.Object.extend({

    	/**
    	 * Страница "Поддержка".
    	 */
    	support: function () {
    		var pageInfo = { pageName: "support", hasSubmenu: false };
    		var view = app.rootView.showBasicLayout(pageInfo);

			$.when(appData.load("processDetails")
					,appData.load("officesInfo",app.principal.regionId))
				.done(function (processDetails, officesInfo) {
					var view = new supportViewType({
						model: new backbone.Model({							
							processDetails: processDetails,
							officesInfo:officesInfo
						})
					});
					app.rootView.showView(view, pageInfo);
				})
				.fail(function (response) {
					view.showError({resultText: appData.getErrorMessage(response)});
				});
        }   
    });

    app.on("before:start", function (data) {
    	if(data.principal) {
    		// Регистрация контроллера только для залогиненного пользователя.
    		app.supportRouter = new routerType({ controller: new controllerType() });	
    	}
    });
});