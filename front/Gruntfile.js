'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    var proxyMiddleware = function (connect, options, middlewares) {
        var proxy = grunt.option('proxy');

        // no proxy
        if (!proxy) {
            return middlewares;
        }

        // proxy is on = all url that starts with '/api/' is proxified to
        // proxy option value or http://localhost:3000 by default
        var target = typeof proxy === 'string' ? proxy : 'http://localhost:3000';
        var server = require('http-proxy').createProxyServer({ target: target });

        middlewares.unshift(function(req, res, next) {
            if (req.url.substr(0, 5) === '/api/') {
                req.url = req.url.substr(4);
                return server.web(req, res);
            }

            return next();
        });

        return middlewares;
    };

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: {
            // Configurable paths
            app: 'app',
            dist: 'dist',
            tmp: '.tmp',
            test: 'test'
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            test: {
                files: ['<%= config.tmp %>/specs.js'],
                tasks: ['test:watch']
            },
            compass: {
                files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer', 'combine_mq']
            },
            styles: {
                files: ['<%= config.app %>/styles/{,*/}*.css'],
                tasks: ['copy:styles', 'autoprefixer', 'combine_mq']
            },
            html: {
                files: ['<%= config.app %>/index.html'],
                tasks: ['processhtml']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.app %>/{,*/}*.html',
                    '<%= config.tmp %>/scripts/{,*/}*.js',
                    '<%= config.tmp %>/styles/{,*/}*.css',
                    '<%= config.app %>/images/{,*/}*'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '<%= config.tmp %>',
                        '<%= config.app %>'
                    ],
                    middleware: proxyMiddleware
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '<%= config.tmp %>',
                        '<%= config.test %>',
                        '<%= config.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= config.dist %>',
                    livereload: false,
                    middleware: proxyMiddleware
                }
            }
        },
        // express server
        express: {
            options: {
                port: 9000,
            },
            dev: {
                options: {
                    script: 'server.js'
                }
            }
        },
        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.tmp %>',
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            server: '<%= config.tmp %>'
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= config.app %>/scripts/**/*.js',
                '!<%= config.app %>/scripts/vendor/*',
                '<%= config.test %>/spec/{,*/}*.js'
            ]
        },

        // Mocha testing framework configuration options
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                }
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= config.app %>/styles',
                cssDir: '<%= config.tmp %>/styles',
                generatedImagesDir: '<%= config.tmp %>/images/generated',
                imagesDir: '<%= config.app %>/images',
                javascriptsDir: '<%= config.app %>/scripts',
                fontsDir: '<%= config.app %>/styles/fonts',
                importPath: '<%= config.app %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= config.dist %>/images/generated'
                }
            },
            server: {
                options: {
                    debugInfo: false
                }
            }
        },

        // browserify bundles
        browserify: {
            options: {
                transform: ['envify', require('grunt-react').browserify]
            },
            server: {
                files: {
                    '<%= config.tmp %>/scripts/bundle.js': '<%= config.app %>/scripts/main.js',
                    '<%= config.tmp %>/specs.js': '<%= config.test %>/spec/{,*/}*.js'
                },
                options: {
                    watch: true
                }
            },
            dist: {
                src: '<%= config.app %>/scripts/main.js',
                dest: '<%= config.tmp %>/scripts/bundle.js'
            },
            test: {
                files: {
                    '<%= config.tmp %>/specs.js': '<%= config.test %>/spec/{,*/}*.js'
                }
            }
        },

        env: {
            test: {
                NODE_ENV: process.env.NODE_ENV || 'test'
            },
            dev: {
                NODE_ENV: process.env.NODE_ENV || 'development'
            },
            prod: {
                NODE_ENV: process.env.NODE_ENV || 'production'
            }
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', '> 1%', 'ie 9']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.tmp %>/styles/',
                    src: '{,*/}*.css',
                    dest: '<%= config.tmp %>/styles/'
                }]
            }
        },

        // regroup mediaqueries
        combine_mq: { // jshint ignore:line
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.tmp %>/styles/',
                    src: '{,*/}*.css',
                    dest: '<%= config.tmp %>/styles/'
                }]
            }
        },

        // add/remove html blocks
        processhtml: {
            options: {
                environment: process.env.NODE_ENV || 'development'
            },
            dist: {
                files: {
                    '<%= config.tmp %>/index.html': '<%= config.app %>/index.html'
                }
            }
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.{gif,jpeg,jpg,png,svg}',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.tmp %>',
                    src: '{,*/}*.html',
                    dest: '<%= config.dist %>'
                }]
            }
        },

        cssmin: {
            dist: {
                files: {
                    '<%= config.dist %>/styles/main.css': [
                        '<%= config.tmp %>/styles/{,*/}*.css'
                    ]
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    '<%= config.dist %>/scripts/bundle.js': [
                        '<%= config.tmp %>/scripts/bundle.js'
                    ]
                }
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        'styles/fonts/{,*/}*.*'
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/styles',
                dest: '<%= config.tmp %>/styles/',
                src: '{,*/}*.css'
            }
        },

        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [
                'compass:server',
                'copy:styles',
                'processhtml'
            ],
            test: [
                'browserify:test'
            ],
            dist: [
                'compass:dist',
                'copy:styles',
                'browserify:dist',
                'imagemin',
                'processhtml'
            ]
        }
    });


    // define default api url
    process.env.api = grunt.option('proxy') ? '/api' : '';

    grunt.registerTask('serve', function (target) {
        grunt.task.run([
            'clean:server',
            'env:dev',
            'concurrent:server',
            'autoprefixer',
            'combine_mq',
            'browserify:server',
            'express:dev',
            'watch'
        ]);
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run([target ? ('serve:' + target) : 'serve']);
    });

    grunt.registerTask('test', function (target) {
        if (target !== 'watch') {
            grunt.task.run([
                'clean:server',
                'env:test',
                'concurrent:test'
            ]);
        }

        grunt.task.run([
            'connect:test',
            'mocha'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'env:prod',
        'concurrent:dist',
        'autoprefixer',
        'combine_mq',
        'cssmin',
        'htmlmin',
        'uglify',
        'copy:dist'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};