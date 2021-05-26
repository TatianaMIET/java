define([
      "jquery"
    , "underscore"
  	, "backbone"
  	, "marionette"
  	, "globalize"
  	, "moment"
  	, "helpers/ui-operations"
  	, "helpers/ui-controls"
  	, "app/app"      
],

/**
 * Доступ к данным приложения.
 */
function (
	$
	, _
	, backbone
	, marionette
	, globalize
	, moment
	, uiOperations
	, uiControls
	, app) {
		
    var appData = {

        /**
         * Список ошибок.
         */
        errors: {
        	SUCCESS: 0,
        	NOT_FOUND: 2,
        	AUTHENTICATION_FAILED: 5
        },    

        
        /**
         * URL по которым можно получить доступ к данным.
         */
        dataUrls: {
			profile: {url: "/home/get-profile", cache: 1200}
			, people: {url: "/home/get-all-people", cache: 1200}
			, friends: {url: "/friends/get-all-friends", cache: 1200}
			, tasks: {url: "/tasks/get-all-tasks", cache: 300}
			, onlyFriends: {url: "/friends/get-only-friends", cache: 1200}
			, meetings: {url: "/meeting/get-all-meetings", cache: 1200}
		},
        
        /**
         * Запуск периодических задач.
         */
        startPeriodicTasks: function() {
        	
        },
        
    	/**
    	 * Кеш данных.
    	 */
    	cache: {},
    	
    	/**
    	 * Загрузка данных. Если данные в кеше актуальны, они берутся из кеша.
    	 * @param {String} name Имя данных в кеше, должно совпадать с ключем для URL. 
    	 * @param {String} suffix Дополнительный ID данных, если по одному URL можно загрузить несколько. 
    	 * @return {Object} Deferred, с помощью которого можно дождаться данных.
    	 */
    	load: function(name, suffix) {
        	// Берем данные из кеша.
        	var dataWrapper = this.getCache(name, suffix);
        	if(dataWrapper.deferred) {
        		// Данных нужно подождать - они загружаются.
        		return dataWrapper.deferred
        	}
        	if(dataWrapper.needRefresh) {
        		// Данные нужно загрузить. 
        		return this.loadInCache(name, suffix);
        	} else {
        		// Данные в кеше актуальны - возвращаем Deferred, который не требует ожидание.
        		var deferred = $.Deferred();
        		deferred.resolve(dataWrapper.data);
        		return deferred;
        	}
        },

    	/**
    	 * Обновление данных вне зависимости от их свежести.
    	 * @param {String} name Имя данных в кеше, должно совпадать с ключем для URL. 
    	 * @param {String} suffix Дополнительный ID данных, если по одному URL можно загрузить несколько. 
    	 * @return {Object} Deferred, с помощью которого можно дождаться данных.
    	 */        
        update: function(name, suffix) {
        	// Берем данные из кеша.
        	var dataWrapper = this.getCache(name, suffix);
        	if(dataWrapper.deferred) {
        		// Данных нужно подождать - они загружаются.
        		return dataWrapper.deferred
        	}
        	return this.loadInCache(name, suffix);       	
        },

        /**
         * Сброс данных в кеше.
    	 * @param {String} name Имя данных в кеше, должно совпадать с ключем для URL. 
    	 * @param {String} suffix Дополнительный ID данных, если по одному URL можно загрузить несколько. 
         */
        reset: function(name, suffix) {
        	var dataWrapper = this.getCache(name, suffix);
        	dataWrapper.data = null;
        },
        
        /**
         * Извлекает текст ошибки из сообщения.
         *  @param {Object} response Данные, которые пришли от сервера. 
         */
        getErrorMessage: function(response) {
			var resultText = globalize.formatMessage("data.requestFailed");
            try {
                var errorData = $.parseJSON(response.responseText);
                if(errorData.resultText) {
                	resultText = errorData.resultText;
                }
            }
            catch (ex) {
            }      
            return resultText;
        },
        
        /**
         * Отправление данных на сервер.
         * @param {Object} form Форма с данными для отправки.
         * @param {String} url URL на который нужно отправить данные.
         * @param {Object} formData Данные для отправки, если их нет, то они берутся у формы.
         */
    	postForm: function(form, url, formData) {
    		var formDataToPost = formData || uiControls.formToJson(form);
    		
        	uiOperations.startRequest(form);
        	return $.ajax({
        		type: "POST",
        		url: app.urlPrefix + url,
        		data: JSON.stringify(formDataToPost),
        		contentType: "application/json",
        		dataType: "json"
        	})
    		.always(_.bind(function(dataOrjqXHR, textStatus, jqXHROrErrorThrown) {
    			// Завершение операции (успех или ошибка).
    			uiOperations.completeRequest(form, dataOrjqXHR, _.bind(function(error, data) {
    				// Отображение известных ошибок (HTTP код НЕ 200).
    				if(data && data.resultCode == this.errors.TOO_MANY_REQUESTS) {
    					// Слишком часто.
    					// validation.showErrorAlert(form, uiControls.formatTooManyRequestsError(data));
    				} else {
    					// Общая проблема.
    					// validation.showErrorAlert(form, data && data.readonly ? error : uiControls.renderErrorWithSupport(error));
    				}   				
    			}, this));
    		}, this));
    	},

    	
        /**
         * Получение данных с сервера.
         * @param {Object} view Вид, который отправил данные.
         * @param {String} url URL на который нужно отправить данные.
         */
    	getData: function(view, url) {   		
        	uiOperations.startRequest(view);
        	return $.ajax({
        		type: "GET",
        		url: app.urlPrefix + url,
        		dataType: "json"
        	})
    		.always(_.bind(function(dataOrjqXHR, textStatus, jqXHROrErrorThrown) {
    			// Завершение операции (успех или ошибка).
    			uiOperations.completeRequest(view, dataOrjqXHR, _.bind(function(error, data) {
    				// Отображение известных ошибок (HTTP код НЕ 200).
    				if(data && data.resultCode == this.errors.TOO_MANY_REQUESTS) {
    					// Слишком часто.
    					view.find("#error-alert").html(uiControls.formatTooManyRequestsError(data));	
    				} else {
    					// Общая проблема.
    					view.find("#error-alert").html(data && data.readonly ? error : uiControls.renderErrorWithSupport(error));    					
    				}   				
    			}, this));
    		}, this));
    	},    	
    	
        /**
         * Отправление данных на сервер.
         * @param {Object} view Вид, который отправил данные.
         * @param {String} url URL на который нужно отправить данные.
         * @param {Object} dataToPost Данные для отправки.
         */
    	postData: function(view, url, dataToPost) {   		
        	uiOperations.startRequest(view);
        	return $.ajax({
        		type: "POST",
        		url: app.urlPrefix + url,
        		data: JSON.stringify(dataToPost),
        		contentType: "application/json",
        		dataType: "json"
        	})
    		.always(_.bind(function(dataOrjqXHR, textStatus, jqXHROrErrorThrown) {
    			// Завершение операции (успех или ошибка).
    			uiOperations.completeRequest(view, dataOrjqXHR, _.bind(function(error, data) {
    				// Отображение известных ошибок (HTTP код НЕ 200).
    				if(data && data.resultCode == this.errors.TOO_MANY_REQUESTS) {
    					// Слишком часто.
    					view.find("#error-alert").html(uiControls.formatTooManyRequestsError(data));	
    				} else {
    					// Общая проблема.
    					view.find("#error-alert").html(data && data.readonly ? error : uiControls.renderErrorWithSupport(error));    					
    				}   				
    			}, this));
    		}, this));
    	},   	
    	
    	/**
    	 * Отображение известных ошибок (HTTP код 200).
         * @param {Object} view Вид, который требует данные.
         * @param {Object} data Результат, полученный с сервера.
    	 */
    	processResultErrorInView: function(view, data) {
    		if(data.resultCode === this.errors.REPEAT_TIMEOUT) {
    			// Слишком часто.
    			view.find("#error-alert").html(data.resultText);
    		} else if(data.resultCode == this.errors.NOT_ALLOWED) {
        		// Операция запрещена.
    			view.find("#error-alert").html(globalize.formatMessage("website.notAllowed"));   			
    		} else {
    			// Общая проблема.
    			view.find("#error-alert").html(data && data.readonly ? error : uiControls.renderErrorWithSupport(data.resultText));
    		}    		
    	},   	
    	    	
        getCache: function(name, suffix) {
        	var dataWrapper = this.cache[name + (suffix ? suffix : "")];
        	if(!dataWrapper) {
        		// В кеше не было данных.
    			dataWrapper = { 
					data: new backbone.Model(), 
					timestamp: moment.utc(), 
					needRefresh: true, 
					deferred: null 
    			};
    			this.cache[name + (suffix ? suffix : "")] = dataWrapper;        		
        	} else {
        		var cache = this.dataUrls[name].cache;
        		if(cache && !dataWrapper.needRefresh) {
        			var now = moment.utc();
        			now.subtract(cache, "s");
        			dataWrapper.needRefresh = dataWrapper.timestamp.isBefore(now);
        		}
        	}
        	
        	return dataWrapper;
        },
        
        loadInCache: function(name, suffix) {
        	var dataWrapper = this.getCache(name, suffix);
			var url = this.dataUrls[name].url;
			var deferred = $.Deferred();
			dataWrapper.deferred = deferred;
			$.get(app.urlPrefix + url + (suffix ? suffix : ""))
				.done(function(data) {
					// Загрузка успешна, обновляем данные.
					dataWrapper.deferred = null;
					dataWrapper.needRefresh = false;
					dataWrapper.timestamp = moment.utc();
					dataWrapper.data.set(data);
					    					
					deferred.resolve(dataWrapper.data);
				})
				.fail(function(response) {
					if(response.status === 403) {
						uiOperations.openUrl();
					}
					// Загрузка не удалась - сообщаем тем кто ожидает данные.
					dataWrapper.deferred = null;
					dataWrapper.needRefresh = true;
					deferred.reject(response);
            	});    
			return deferred;
        }
	};
    
    app.on("start", function (data) {
    	if(data.principal) {
    	}
    });	    
    
    return appData;
});