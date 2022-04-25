var gulp = require('gulp');

var concat = require('gulp-concat'),
    fileinclude = require('gulp-file-include'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    scss = require('gulp-sass')(require('sass')),
    sourcemaps = require('gulp-sourcemaps'),
    clean = require('gulp-clean'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    path = require('path'),
    browserSync = require('browser-sync').create();

var src = './src';
var dist = './dist';
var paths = {
    html : src + '/**/*.html',
    js : src + '/js/**/*.js',
    scss : src + '/scss/**/*.scss',
    img: src + '/images/**/*.*',
    fonts: src + '/fonts/**/*.*'
};

// clean
gulp.task('clean', function () {
    return gulp.src(dist + '/*')
        .pipe(clean());
});

// html
gulp.task('html', function () {
    return gulp
        .src([paths.html, '!./src/include/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            context: {
                nav: true
            }
        }))
        .pipe(gulp.dest(dist))
        .pipe(browserSync.stream());
});

// scss option
var scssOptions = {
    // outputStyle: "compressed",
    indentType: "tab",
    indentWidth: 1,
    precision: 6,
    sourceComments: false
};

// scss
gulp.task('scss:compile', function () {
    return gulp
        .src(paths.scss) //불러오기
        // .pipe(sourcemaps.init())//소스맵 초기화
        .pipe(scss(scssOptions).on('error', scss.logError))
        .pipe(concat('style.css')) //병합
        .pipe(autoprefixer())
        // .pipe(sourcemaps.write()) //소스맵
        .pipe(gulp.dest(dist + '/css')) //생성
        .pipe(browserSync.stream());
});

// js
gulp.task('js:combine', function () {
    return gulp
        .src(paths.js) //불러오기
        // .pipe(sourcemaps.init())//소스맵 초기화
        // .pipe(concat('common.js')) // 병합
        // .pipe(gulp.dest('./dist/js')) // 생성
        // .pipe(uglify()) //난독화
        // .pipe(rename('common.min.js')) //이름바꾸기
        // .pipe(sourcemaps.write()) //소스맵
        .pipe(gulp.dest(dist + '/js')) // 생성
        .pipe(browserSync.stream());

});

// img
gulp.task('img', function () {
    return gulp
        .src(paths.img) //불러오기
        .pipe(gulp.dest('./dist/images')) // 생성
        .pipe(browserSync.stream());

});

// fonts
gulp.task('fonts', function () {
    return gulp
        .src(paths.fonts) //불러오기
        .pipe(gulp.dest('./dist/fonts')) // 생성
        .pipe(browserSync.stream());

});

// browserSync
gulp.task('browserSync', () => {
    return new Promise(resolve => {
        browserSync.init(null, {
            port: 9999,
            server: {
                baseDir: 'dist',
                index: "status.html"
            },
            browser: "chrome"
        });
        resolve();
    });
});

function watch(){
    gulp.watch(paths.html, gulp.series('html'));
    gulp.watch(paths.js, gulp.series('js:combine'));
    gulp.watch(paths.scss, gulp.series('scss:compile'));
    gulp.watch(paths.img, gulp.series('img'));
};

gulp.task('default', gulp.series('clean', 'html', 'scss:compile', 'js:combine', 'img', 'fonts', 'browserSync', watch));