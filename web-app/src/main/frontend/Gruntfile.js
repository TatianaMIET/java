module.exports = function (grunt) {
    grunt.initConfig({
        bowercopy: {
            options: {
                clean: false
            },
            libsJs: {
                options: {
                    destPrefix: '../webapp/assets/js/libs'
                },
                files: {
                    'jquery.js': 'jquery/dist/jquery.js',
                    'jquery.inputmask.bundle.js': 'jquery.inputmask/dist/jquery.inputmask.bundle.js',
                    'require.js': 'requirejs/require.js',
                    'parsley.js': 'parsleyjs/dist/parsley.js',
                    'parsley-ru.js': 'parsleyjs/dist/i18n/ru.js',
                    'es5-shim.js': 'es5-shim/es5-shim.min.js',
                    'es5-sham.js': 'es5-shim/es5-sham.min.js',
                    'json2.js': 'json2-ie8/json2.js',
                    'respond.js': 'respond/dest/respond.min.js',
                    'require-text.js': 'requirejs-text/text.js',
                    'require-json.js': 'requirejs-plugins/src/json.js',
                    'underscore.js': 'underscore/underscore.js',
                    'backbone.js': 'backbone/backbone.js',
                    'marionette.js': 'marionette/lib/backbone.marionette.js',
                    'cocktail.js': 'cocktail/Cocktail.js',
                    'form2js.js': 'form2js/src/form2js.js',
                    'iso8601.js': 'js-iso8601/iso8601.js',
                    'moment.js': 'moment/moment.js',
                    'moment-ru.js': 'moment/locale/ru.js',
                    'select2.js': 'select2/dist/js/select2.js',
                    'zxcvbn.js': 'zxcvbn/dist/zxcvbn.js',
                    'globalize': 'globalize/dist/globalize',
                    'globalize.js': 'globalize/dist/globalize.js',
                    'cldr.js': 'cldrjs/dist/cldr.js',
                    'cldr': 'cldrjs/dist/cldr',
                    'pikaday.js': 'pikaday/pikaday.js',
                    'pikaday.jquery.js': 'pikaday/plugins/pikaday.jquery.js',
                    "uri.js": "urijs/src/URI.js",
                    "punycode.js": "urijs/src/punycode.js",
                    "SecondLevelDomains.js": "urijs/src/SecondLevelDomains.js",
                    "IPv6.js": "urijs/src/IPv6.js",
                    "ion.rangeSlider.js": "ion.rangeSlider/js/ion.rangeSlider.js",
                    "rangeslider.js": "rangeslider.js/dist/rangeslider.js",
                    "js.cookie.js": "js-cookie/src/js.cookie.js"
                }
            },
            libsCss: {
                options: {
                    destPrefix: '../webapp/assets/css'
                },
                files: {
                    'font-awesome.css': 'Font-Awesome/css/font-awesome.css',
                    'font-awesome.css.map': 'Font-Awesome/css/font-awesome.css.map',
                    'normalize.css': 'normalize.css/normalize.css',
                    'pikaday.css': 'pikaday/css/pikaday.css',
                    'select2.css': 'select2/dist/css/select2.css',
                    'ion.rangeSlider.css': 'ion.rangeSlider/css/ion.rangeSlider.css'                    	
                }
            },
            libsLess: {
                options: {
                    destPrefix: '../webapp/assets/less/libs'
                },
                files: {
                    'skeleton.less': 'skeleton-less/less/skeleton.less'
                }
            },            
            awesomeFonts: {
                options: {
                    destPrefix: '../webapp/assets'
                },
                files: {
                    'fonts': 'Font-Awesome/fonts'
                }
            },
            cldrDataMain: {
                options: {
                    destPrefix: '../webapp/assets/js/libs/cldr-data/main'
                },
                files: {
                    'ru': 'cldr-data/main/ru'
                }
            },
            cldrDataSegments: {
                options: {
                    destPrefix: '../webapp/assets/js/libs/cldr-data/segments'
                },
                files: {
                    'ru': 'cldr-data/segments/ru',
                    'root': 'cldr-data/segments/root'
                }
            },
            cldrDataSupplemental: {
                options: {
                    destPrefix: '../webapp/assets/js/libs/cldr-data'
                },
                files: {
                    'supplemental': 'cldr-data/supplemental'
                }
            }
        },
        less: {
            development: {
                options: {
                    sourceMap: true,
                    sourceMapRootpath: '/',
                    outputSourceFiles: true
                },
                files: {
                    '../webapp/assets/css/theme-main.css': '../webapp/assets/less/theme-main.less'
                }
            }
        },
        replace: {
            fixsourcemaps: {
                src: ['../webapp/assets/css/*.css'],
                dest: '../webapp/assets/css/',
                replacements: [{
                    from: 'sourceMappingURL=../webapp/assets/css/',
                    to: 'sourceMappingURL='
                }]
            },
            fixParsleyRu: {
                src: ['../webapp/assets/js/libs/parsley-ru.js'],
                dest: '../webapp/assets/js/libs/parsley-ru.fixed.js',
                replacements: [{
                    from: "Parsley.addMessages('ru', {",
                    to: "(function( factory ) { if ( typeof define === 'function' && define.amd ) { define( ['jquery'], factory ); } else { factory( jQuery ); } }(function( $ ) { Parsley.addMessages('ru', {"
                }, {
                    from: "Parsley.setLocale('ru');",
                    to: "Parsley.setLocale('ru'); }));"
                }]
            },
            fixRequireJs: {
                src: ['../webapp/assets/js/libs/require.js'],
                dest: '../webapp/assets/js/libs/require.fixed.js',
                replacements: [{
                    from: "waitSeconds: 7",
                    to: "waitSeconds: 60 * 3"
                }]
            },
            fixSelect2Js: {
                src: ['../webapp/assets/js/libs/select2.js'],
                dest: '../webapp/assets/js/libs/select2.fixed.js',
                replacements: [{
                	from: /if \(original\.indexOf\(term\) > -1\)([^\}])*\}/g,
                    to: "if (original.indexOf(term) > -1) { return data; } if (original.indexOf(term.replace('Е','Ё')) > -1) { return data; }"
                }]
            }
        },
        modernizr: {
        	dist: {
        		"crawl": false,
        		"customTests": [],
        		"dest": "../webapp/assets/js/libs/modernizr.js",
        		"tests": [
        		          "json",
        		          "svg",
        		          "touchevents",
        		          "unicode",
        		          "animation",
        		          "cssanimations",
        		          "backgroundsize",
        		          "boxshadow",
        		          "boxsizing",
        		          "checked",
        		          "ellipsis",
        		          "flexbox",
        		          "fontface",
        		          "cssgradients",
        		          "lastchild",
        		          "mediaqueries",
        		          "nthchild",
        		          "opacity",
        		          "rgba",
        		          "cssscrollbar",
        		          "textshadow",
        		          "csstransforms",
        		          "csstransitions",
        		          "unknownelements",
        		          "svgasimg",
        		          "inlinesvg",
        		          "textareamaxlength"
        		  ],
        		  "options": [
        		              "setClasses"
        		  ],
        		  "uglify": false
        	}
        },        
        requirejs: {
            compile: {
                options: {
                    name: 'config',
                    baseUrl: "../webapp/assets/js",
                    out: '../../../target/frontend/assets/js/scripts.min.js',
                    mainConfigFile: '../webapp/assets/js/config.js',
                    optimize: 'uglify2',
                    generateSourceMaps: true,
                    preserveLicenseComments: false,
                    include: [
                        'app/startup'
                    ]
                }
            }
        },
        concat: {
            cssMain: {
                options: {
                    sourceMap: true,
                    sourceMapStyle: 'embed'
                },
                src: [
                    '../webapp/assets/css/normalize.css',
                    '../webapp/assets/css/font-awesome.css',
                    '../webapp/assets/css/select2.css',
                    '../webapp/assets/css/pikaday.css',
                    '../webapp/assets/css/ion.rangeSlider.css',
                    '../webapp/assets/css/theme-main.css',
                    '!../webapp/assets/css/*.min.css'],
                dest: '../../../target/frontend/assets/css/styles.css'
            }
        },
        cssmin: {
            options: {
                rebase: true,
                sourceMap: true,
                sourceMapInlineSources: true,
                target: '../webapp/assets/css',
                relativeTo: "assets/img"
            },
            css: {
                files: [{
                    expand: true,
                    cwd: '../../../target/frontend/assets/css',
                    src: ['styles.css', '!*.min.css'],
                    dest: '../../../target/frontend/assets/css',
                    ext: '.min.css'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-modernizr');

    grunt.registerTask('fast', ['less', 'replace']);
    grunt.registerTask('compile', ['bowercopy', 'less', 'replace', 'modernizr']); 
    grunt.registerTask('package', ['requirejs', 'concat', 'cssmin']);
    grunt.registerTask('all', ['compile', 'package']);
    grunt.registerTask('default', ['all']);
}