'use strict';

var gulp        = require('gulp');
var watchify    = require('watchify');
var nodemon     = require('gulp-nodemon');
var eslint      = require('gulp-eslint');
var runSequence = require('run-sequence');

var path = {
    development: {
        src: {
            serverScripts: './src/**/*.js'
        }
    }
};

var options = {
    watchify: {
        poll: true
    },
    eslint: {
        configFile: './eslintrc.json'
    },
    nodemon: {
        script: 'src/app.js',
        ext: 'scss js jsx',
        ignore: ['gulpfile.js'],
        nodeArgs: ['--debug=5000', '--max-old-space-size=2048'],
        watch: ['src', 'static'],
        env: {
            'NODE_PATH': '.',
            'CONFIG': './src/config/config.json',
            'FLUSH_CACHE': true
        }
    }
};

// -------------------------
// GULP TASKS
// -------------------------

gulp.task('_lint-js', function () {

    return gulp.src([path.development.src.serverScripts])
        .pipe(eslint(options.eslint))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());

});

gulp.task('_watch', function () {

    gulp.watch(path.development.src.serverScripts, ['_lint-js']);

});

// -------------------------
// RUN
// -------------------------

gulp.task('start', function (cb) {

    runSequence(
        '_lint-js',
        '_watch',
        function () {
            nodemon(options.nodemon);
            cb();
        }
    );

});
