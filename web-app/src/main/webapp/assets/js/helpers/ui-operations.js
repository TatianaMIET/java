define([    
	  "underscore"
    , "backbone"
    , "marionette"
    , "globalize"
    , "uri"
    , "app/app"
],

/**
 * Вспомогательные методы для пользовательского интерфейса.
 */

function (
	_
	, backbone
	, marionette
	, globalize
	, uri
	, app) {

    return {

    	showErrorText: function(view, text) {
    	    var mainErrorNode = document.getElementById("main-error");
    	    if(mainErrorNode) {
    	    	mainErrorNode.innerHTML = text;
    	    }
    	},	 
    	
    	/**
    	 * Безопасное открытие URL.
    	 * @param {String} url URL нашего домена, который нужно открыть.
    	 */
    	openUrl: function(url) {
    		backbone.history.stop();
    		if(url) {
    			var newUrl = uri(url).resource();
    			window.location.replace(newUrl);
    		} else {
    			window.location.replace(app.urlPrefix + "#"); 
    		}
    		window.location.reload();
    	},

    	
    	/**
    	 * Запуск AJAX запроса.
    	 * @param {Object} view Элемент, для которого осуществляется обновление данных.
    	 */
    	startRequest: function(view) {
    		var correctedView = view || $("body");

			// Запрещаем двойные нажатия на кнопки.
    		correctedView.find("[type=submit]").each(function() {
    			var button = $(this);
    			if(!button.prop("disabled")) {
    				button.prop("disabled", true); 
    				button.attr("data-request-start", "true");
    			}
    		});

			// Показ крутилки.
    		if (correctedView.children().length) {
    			correctedView.attr("data-position", correctedView.css("relative"));
    			correctedView.css({ position: "relative" });
    			correctedView.prepend("<div class='friends-loading-spinner friends-loading-spinner-over'></div>");
            } else {
            	correctedView.addClass("friends-loading-spinner");
            }   		
    		
    		correctedView.attr("data-request", "true");
    		correctedView.find("#error-alert").empty();
    	},	   	

    	/**
    	 * Завершение AJAX запроса.
    	 * @param {Object} view Элемент, для которого осуществляется обновление данных.
    	 * @param {Object} jqXHROrErrorThrown Описание результат или ошибка.
    	 * @param {Function} errorAlertCallback Метод для показа ошибки, может не существовать.
    	 */
    	completeRequest: function(view, dataOrjqXHR, errorAlertCallback) {
    		var correctedView = view || $("body");
    		
			// Разрешаем запрещенные кнопки.
    		correctedView.find("[type=submit]").each(function() {
    			var button = $(this);
    			if(button.attr("data-request-start") == "true") {
    				button.prop("disabled", false);
    				button.attr("data-request-start", "");
    			}
    		});
    		
    		correctedView.attr("data-request", "false");
    		
			// Скрытие крутилки.
            $(".friends-loading-spinner-over", correctedView).remove();
            correctedView.removeClass("friends-loading-spinner");
            var position = correctedView.attr("data-position");
            if(position) {
            	correctedView.attr("data-position", "");
            	correctedView.css({ position: position });
            }
			
            // Проверка ошибок.
            var genericAlert = null;
            var additionalData = null;
    		if(!dataOrjqXHR || (dataOrjqXHR.statusText && dataOrjqXHR.statusText === "success")) {
    			// Все успешно.
    		} else if(dataOrjqXHR.statusText) {
    			// Пришел ответ с ошибкой.    			
                if (dataOrjqXHR.statusText === "timeout") {
                    // Request timeout.
                	genericAlert = globalize.formatMessage("data.timeoutError");
                } else if (dataOrjqXHR.status === 401 || dataOrjqXHR.status === 403) {
                    // Forbidden.
                	genericAlert = globalize.formatMessage("data.forbiddenError");
                	if(dataOrjqXHR.status === 403 && app.principal.loginType === "CALL_CENTER") {
                    	genericAlert = globalize.formatMessage("data.readonly");
                    	additionalData = { readonly: true };
                	} else {
                    	setTimeout(this.openUrl, 3000)
                	}
                	//this.openUrl();
                } else if (dataOrjqXHR.status === 404) {
                    // Data not found.
                	genericAlert = globalize.formatMessage("data.notFoundError");
                } else if (dataOrjqXHR.status === 424) {
                    // Error with specified text.
                	genericAlert = response.responseText;
                } else if (dataOrjqXHR.status === 422) {
                    // Validation error.
                    try {
                        var data = $.parseJSON(dataOrjqXHR.responseText);
                        if (correctedView.is("form")) {
                        //	validation.showErrors(correctedView, data);
                        } else {
                        	correctedView.find("form").each(function () {
                        //		validation.showErrors($(this), data);
                            });
                        }
                    }
                    catch (ex2) {
                    	genericAlert = globalize.formatMessage("data.genericError");
                    }
                } else if (dataOrjqXHR.statusText === "error" || dataOrjqXHR.status >= 400) {
                	genericAlert = globalize.formatMessage("data.genericError");
                	 try {
                		 // Пытаемся получить данные ошибки.
                		 additionalData = $.parseJSON(dataOrjqXHR.responseText);
                		 if(additionalData.resultText) {
                			 genericAlert = additionalData.resultText;
                		 }
                      }
                     catch (ex3) {
                     }              	
                }
    		} else {
    			// Тоже успех (это данные).
    		}
    		
    		if(genericAlert !== null) {
    			// Отображение общей ошибки.
    			if(errorAlertCallback) {
    				errorAlertCallback(genericAlert, additionalData);
    			} else {
    				correctedView.find("#error-alert").html(genericAlert);
    			}
    		}
    	}
    };
});