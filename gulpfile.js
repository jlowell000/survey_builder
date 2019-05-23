const ENV = 'LOCAL'

if (ENV === 'LOCAL') {
    let gulp = require("gulp"),
        browserify = require("browserify"),
        source = require('vinyl-source-stream'),
        watchify = require("watchify"),
        tsify = require("tsify"),
        fancy_log = require("fancy-log"),
        paths = {
            pages: ['src/*.html']
        },
        watchedBrowserify = watchify(browserify({
            basedir: '.',
            debug: true,
            entries: ['src/main.ts'],
            cache: {},
            packageCache: {}
        }).plugin(tsify));

    gulp.task("copy-html", function () {
        return gulp.src(paths.pages)
            .pipe(gulp.dest("dist"));
    });

    function bundle() {
        return watchedBrowserify
            .bundle()
            .pipe(source('bundle.js'))
            .pipe(gulp.dest("dist"));
    }

    gulp.task("default", gulp.series(gulp.parallel('copy-html'), bundle));
    watchedBrowserify.on("update", bundle);
    watchedBrowserify.on("log", fancy_log);
}

if (ENV === 'PROD') {
     gulp = require("gulp"),
     browserify = require("browserify"),
     source = require('vinyl-source-stream'),
     tsify = require("tsify"),
     uglify = require('gulp-uglify'),
     sourcemaps = require('gulp-sourcemaps'),
     buffer = require('vinyl-buffer'),
     paths = {
        pages: ['src/*.html']
    };
    
    gulp.task("copy-html", function () {
        return gulp.src(paths.pages)
            .pipe(gulp.dest("dist"));
    });
    
    gulp.task("default", gulp.series(gulp.parallel('copy-html'), function () {
        return browserify({
            basedir: '.',
            debug: true,
            entries: ['src/main.ts'],
            cache: {},
            packageCache: {}
        })
        .plugin(tsify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("dist"));
    }));
}