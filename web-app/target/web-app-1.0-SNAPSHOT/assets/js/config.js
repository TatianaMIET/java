require.config({
    baseUrl: ((typeof globalSettings !== "undefined") ? globalSettings.urlPrefix : "/") + "/assets/js",
    paths: {
          "templates": "../templates"
        , "messages": "../../messages"
        , "text": "libs/require-text"
        , "json": "libs/require-json"
        , "jquery": "libs/jquery"
        , "parsley": "libs/parsley"
        , "parsley-ru": "libs/parsley-ru.fixed"
        , "inputMask": "libs/jquery.inputmask.bundle"
        , "underscore": "libs/underscore"
        , "backbone": "libs/backbone"
        , "marionette": "libs/marionette"
        , "cocktail": "libs/cocktail"
        , "form2js": "libs/form2js"
        , "iso8601": "libs/iso8601"
        , "moment": "libs/moment"
        , "moment-ru": "libs/moment-ru"
        , "cldr": "libs/cldr"
        , "cldr-data": "libs/cldr-data"
        , "globalize": "libs/globalize"
        , "modernizr": "libs/modernizr"
        , "select2": "libs/select2.fixed"
        , "zxcvbn": "libs/zxcvbn.fixed"
        , "pikaday": "libs/pikaday"
        , "pikadayJquery": "libs/pikaday.jquery"
        , "uri": "libs/uri"
        , "punycode": "libs/punycode"
        , "SecondLevelDomains": "libs/SecondLevelDomains"
        , "IPv6": "libs/IPv6"
        , "rangeSlider": "libs/ion.rangeSlider"
        , "rangeSliderJs": "libs/rangeslider"
        , "jsCookie": "libs/js.cookie"
    },
    shim: {
        "jquery": {
            exports: ["jQuery", "$"]
        }
        , "parsley": {
            deps: ["jquery"]
        }
        , "parsley-ru": {
            deps: ["jquery", "parsley"]
        }       
        , "underscore": {
            exports: "_",
            deps: ["jquery"]
        }
        , "backbone": {
            exports: "Backbone",
            deps: ["jquery", "underscore"]
        }
        , "marionette": {
            exports: "Marionette",
            deps: ["jquery", "underscore", "backbone"]
        }
        , "modernizr": {
            exports: "Modernizr"
        }
        , "inputMask": {
        	deps: ["jquery"]
        } 
        , "rangeSlider": {
        	deps: ["jquery"]
        }
        , "rangeSliderJs": {
        	deps: ["jquery"]
        }
    },
      urlArgs: (typeof globalSettings !== "undefined") ? globalSettings.urlArgs : ""
    , waitSeconds: (typeof globalSettings !== "undefined") ? globalSettings.waitSeconds : 60
});

function trace(s, error) {
	if ("console" in self && "log" in console) {
		console.log(s)
	} else if(error) {
		alert(s);
	} 
}    

function showGenericError() {
    var mainErrorNode = document.getElementById("main-error");
    if(mainErrorNode) {
    	mainErrorNode.innerHTML = globalSettings.errorMessage;
    }
}

require.onError = function (err) {
    showGenericError();
        
    trace(err.requireType, true);
    if (err.requireType === "timeout") {
    	trace("modules: " + err.requireModules, true);
    }

    throw err;
};

require([
      "underscore"
    , "backbone"
    , "moment"

    , "globalize"

    , "json!cldr-data/main/ru/ca-gregorian.json"
	, "json!cldr-data/main/ru/currencies.json"
	, "json!cldr-data/main/ru/dateFields.json"
	, "json!cldr-data/main/ru/numbers.json"
    , "json!cldr-data/main/ru/delimiters.json"
    , "json!cldr-data/main/ru/units.json"
    , "json!cldr-data/main/ru/languages.json"

	, "json!cldr-data/supplemental/plurals.json"
    , "json!cldr-data/supplemental/ordinals.json"
	, "json!cldr-data/supplemental/timeData.json"
	, "json!cldr-data/supplemental/weekData.json"
    , "json!cldr-data/supplemental/likelySubtags.json"
   
    , "globalize/currency"
	, "globalize/date"
	, "globalize/message"
	, "globalize/number"
	, "globalize/plural"
	, "globalize/relative-time"
    
	, "moment-ru"
    , "iso8601"
    , "parsley"
    , "parsley-ru"
    , "modernizr"
    , "select2"
    , "inputMask"
    , "pikadayJquery"
    , "uri"
    , "rangeSlider"
    , "rangeSliderJs"
], function (
      _
    , backbone
    , moment
    
    , globalize

    , caGregorianRu
	, currenciesRu
	, dateFieldsRu
	, numbersRu
    , delimitersRu
    , unitsRu
    , languagesRu
    
	, plurals
    , ordinals
	, timeData
	, weekData
    , likelySubtags
) {
    globalize.load(
          caGregorianRu
        , currenciesRu
        , dateFieldsRu
        , numbersRu
        , delimitersRu
        , unitsRu
        , languagesRu

        , plurals
        , ordinals
        , timeData
        , weekData
        , likelySubtags
    );

    // Setup global settings.
    _.templateSettings = {
        evaluate: /{{([\s\S]+?)}}/g,
        interpolate: /{{=([\s\S]+?)}}/g,
        escape: /{{-([\s\S]+?)}}/g
    };
    backbone.Model.prototype.idAttribute = "Id";

    globalize.locale(globalSettings.currentLanguage);
    moment.locale(globalSettings.currentLanguage);

    $.ajaxSetup({ timeout: globalSettings.waitSeconds * 1000 });

    require(["app/startup"], function (startup) {
        startup.start(globalSettings);
    });
});