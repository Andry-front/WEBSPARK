let gulp = require('gulp');
let autoprefixer = require('gulp-autoprefixer');
let sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('../style/scss/**/*.scss')
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest('dist'))
        .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('../style/css'));
});

gulp.task('watch', function () {
    gulp.watch('../style/scss/**/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.series('sass', 'watch'));