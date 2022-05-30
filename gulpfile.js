const gulp =         require('gulp');
const concat =       require('gulp-concat');
const fileinclude =  require('gulp-file-include');
const uglify =       require('gulp-uglify');
const rename =       require('gulp-rename');
const scss =         require('gulp-sass')(require('sass'));
const sourcemaps =   require('gulp-sourcemaps');
const clean =        require('gulp-clean');
const autoprefixer = require('gulp-autoprefixer');
const dependents =   require('gulp-dependents');
const cached =       require('gulp-cached');
const browserSync =  require('browser-sync').create();

const src = './src';
const dist = './dist';
const paths = {
    html : src + '/**/*.html',
    js : src + '/js/**/*.js',
    scss : src + '/scss/**/*.scss',
    img: src + '/images/**/*.*',
    fonts: src + '/fonts/**/*.*'
};

// clean
gulp.task('clean', () => {
    return gulp.src(dist + '/*')
        .pipe(clean());
});

// html
gulp.task('html', () => {
    return gulp
		// .src([paths.html, '!./src/include/*.html'], { since: gulp.lastRun('html') })
		.src([paths.html, '!./src/include/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
		.pipe(cached('html'))
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
gulp.task('scss', () => {
	return gulp
		// .src(paths.scss) //불러오기
		.src(paths.scss, { since: gulp.lastRun('scss') }) //불러오기
		.pipe(dependents())
        .pipe(sourcemaps.init())//소스맵 초기화
        .pipe(scss(scssOptions).on('error', scss.logError))
        .pipe(concat('style.css')) //병합
        .pipe(autoprefixer())
        .pipe(sourcemaps.write()) //소스맵
        .pipe(gulp.dest(dist + '/css')) //생성
        .pipe(browserSync.stream());
});

// js
gulp.task('js', () => {
    return gulp
		.src(paths.js, { since: gulp.lastRun('js') }) //불러오기
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
gulp.task('img', () => {
    return gulp
		.src(paths.img, { since: gulp.lastRun('img') }) //불러오기
        .pipe(gulp.dest('./dist/images')) // 생성
        .pipe(browserSync.stream());

});

// fonts
gulp.task('fonts', () => {
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
			// browser: ["google chrome"]
        });
        resolve();
    });
});

const watch = () => {
    gulp.watch(paths.html, gulp.series('html'));
    gulp.watch(paths.js, gulp.series('js'));
    gulp.watch(paths.scss, gulp.series('scss'));
    gulp.watch(paths.img, gulp.series('img'));
};

// 순차
gulp.task('default', gulp.series('clean', 'html', 'scss', 'js', 'img', 'fonts', 'browserSync', watch));
// 동시
// gulp.task('default', gulp.series('clean', gulp.parallel('html', 'scss', 'js', 'img', 'fonts'), 'browserSync', watch));