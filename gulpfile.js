// var gulp = require('gulp');
// var scss = require('gulp-sass');
// var sourcemaps = require('gulp-sourcemaps');


// var PATH = {
//     ASSETS: {
//         FONTS: './src/fonts',
//         IMAGES: './src/images',
//         STYLE: './src/css'
//     }
// },
// DEST_PATH = {
//     ASSETS: {
//         FONTS: './dist/fonts',
//         IMAGES: './dist/images',
//         STYLE: './dist/css'
//     }
// };
// gulp.task('scss:compile', () => {
//     return new Promise(resolve => {
//         var options = {
//             outputStyle: "nested",
//             indentType: "space",
//             indentWidth: 4,
//             precision: 8,
//             sourceComments: true
//         };
//         gulp.src(PATH.ASSETS.STYLE + '/*.scss')
//         .pipe(sourcemaps.init())
//         .pipe(scss(options))
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest(DEST_PATH.ASSETS.STYLE));
        
//         resolve();
//     });
// });

// gulp.task('default', gulp.series(['scss:compile']));



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
    img : src + '/images/**/*.*'
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
    outputStyle: "compact",
    indentType: "tab",
    indentWidth: 1,
    precision: 6,
    sourceComments: false
};

// scss
gulp.task('scss:compile', function () {
    return gulp
        .src(paths.scss) //불러오기
        .pipe(sourcemaps.init())//소스맵 초기화
        .pipe(scss(scssOptions).on('error', scss.logError))
        .pipe(concat('common.css')) //병합
        .pipe(autoprefixer())
        .pipe(sourcemaps.write()) //소스맵
        .pipe(gulp.dest(dist + '/css')) //생성
        .pipe(browserSync.stream());
});

// js
gulp.task('js:combine', function () {
    return gulp
        .src(paths.js) //불러오기
        // .pipe(sourcemaps.init())//소스맵 초기화
        .pipe(concat('common.js')) // 병합
        .pipe(gulp.dest('./dist/js')) // 생성
        .pipe(uglify()) //난독화
        .pipe(rename('common.min.js')) //이름바꾸기
        // .pipe(sourcemaps.write()) //소스맵
        .pipe(gulp.dest('./dist/js')) // 생성
        .pipe(browserSync.stream());

});

// img
gulp.task('img', function () {
    return gulp
        .src(paths.img) //불러오기
        .pipe(gulp.dest('./dist/images')) // 생성
        .pipe(browserSync.stream());

});

// browserSync
gulp.task('browserSync', () => {
    return new Promise(resolve => {
        browserSync.init(null, {
            // proxy: 'http://localhost:8888',
            port: 9999,
            server: "./dist"
        });
        resolve();
    });
});

function watch(){

// gulp.task('watch', function () {

    // browserSync.init({
    //     port: 3333,
    //     server: "./dist"
    // });

    gulp.watch(paths.html, gulp.series('html'));
    gulp.watch(paths.js, gulp.series('js:combine'));
    gulp.watch(paths.scss, gulp.series('scss:compile'));
    gulp.watch(paths.img, gulp.series('img'));


    // var watcher = gulp.watch(paths.html, gulp.series('html'));
    // var watcher = gulp.watch(paths.img, gulp.series('img'));
    // watcher.on('unlink', function (filepath) {
    //     var destFilePath = path.basename(filepath);
    //     del.sync(dist + '/**/' + destFilePath);
    // });
// });

}

// gulp.task('default', gulp.series('browserSync', 'watch'));
gulp.task('default', gulp.series('clean', 'html', 'scss:compile', 'js:combine', 'img', 'browserSync', watch));
