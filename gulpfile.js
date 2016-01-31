'use strict';

// include gulp
var gulp           = require('gulp');

// include plug-ins
var changed        = require('gulp-changed');
var imagemin       = require('gulp-imagemin');
var minifyHTML     = require('gulp-minify-html');
var jshint         = require('gulp-jshint');
var concat         = require('gulp-concat');
var stripDebug     = require('gulp-strip-debug');
var uglify         = require('gulp-uglify');
var autoprefix     = require('gulp-autoprefixer');
var minifycss      = require('gulp-minify-css');
var sass           = require('gulp-sass');
var sourcemaps     = require('gulp-sourcemaps');
var jade           = require('gulp-jade');
var notify         = require("gulp-notify");
var plumber        = require('gulp-plumber');
var clean          = require('gulp-clean');
var stripDebug     = require('gulp-strip-debug');
var rename         = require('gulp-rename');

// package name
var pkg            = require('./package.json');
var version        = pkg.version;
var name           = pkg.name;
var browsers       = pkg.browsers;
// source
var imgSource      = './src/images/**/*';
var htmlSource     = './src/html/*.html';
var jadeSource     = './src/jade/*.jade';
var sassSource     = './src/sass/styles.scss';
var jsSource       = './src/scripts/*.js'  

// target
var htmlTarget     = './www/';
var assetsTarget   = './www/assets/';
var cssTarget      = './www/assets/css/';
var jsTarget       = './www/assets/js/';
var fontsTarget    = './www/assets/fonts/';



var sourcesjs      =  [     
'bower_components/modernizr/modernizr.js',
'bower_components/jquery/dist/jquery.js',

'bower_components/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
'bower_components/bootstrap-sass/assets/javascripts/bootstrap/alert.js',
'bower_components/bootstrap-sass/assets/javascripts/bootstrap/button.js',
'bower_components/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
'bower_components/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
'bower_components/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
'bower_components/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
'bower_components/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
'bower_components/bootstrap-sass/assets/javascripts/bootstrap/popover.js',
'bower_components/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
'bower_components/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
'bower_components/bootstrap-sass/assets/javascripts/bootstrap/affix.js',

// 'bower_components/waterwheelcarousel/js/jquery.waterwheelCarousel.js',
'bower_components/jquery-sticky/jquery.sticky.js',
//'.src/scripts/mousewheel/js/jquery.mousewheel-3.0.6.pack.js',

//'bower_components/fancybox/source/jquery.fancybox.pack.js',
//'bower_components/fancybox/source/helpers/jquery.fancybox-media.js',
//'bower_components/fancybox/source/helpers/jquery.fancybox-buttons.js',

'bower_components/superfish/dist/js/hoverIntent.js',  
'bower_components/superfish/dist/js/superfish.js',
'bower_components/superfish/dist/js/supersubs.js',
//'bower_components/flexslider/jquery.flexslider.js',

// 'bower_components/flickity/dist/flickity.pkgd.js',
// 'bower_components/isotope/js/isotope.js',
// 'bower_components/rs-plugin/js/jquery.themepunch.tools.min.js',
// 'bower_components/rs-plugin/js/jquery.themepunch.revolution.min.js',
//'bower_components/jquery.stellar/jquery.stellar.js',
// 
'bower_components/imagesloaded/imagesloaded.pkgd.js',

'./src/scripts/scripts.js',
'./src/scripts/main.js'
];
var custom_sourcesjs = [
    './src/scripts/scripts.js',
    './src/scripts/main.js'
];

// tasks 


//clean task
gulp.task('clean', function() {
    return gulp.src(assetsTarget,{
            read:false
        })
        .pipe(clean({force: true}));
});


gulp.task('copyfont', function() {
    gulp.src([ 
              './bower_components/bootstrap-sass/assets/fonts/bootstrap/*', 
              './bower_components/components-font-awesome/fonts/*'
             ])
      .pipe(gulp.dest(fontsTarget))
      .pipe(notify({
          title: 'fontIconBootstrap',
          message: 'copy - completed'
      }));

});

//jade task
/*gulp.task('jade', function() {
  gulp.src([jadeSource])
    .pipe(jade())
    .pipe(gulp.dest(jadeTarget))
    .pipe(notify({
            title: 'jade',
            message: 'jade - completed the work!'
    }));
}); 
*/
// JS hint task
gulp.task('jshint', function() {
    return gulp.src(custom_sourcesjs)
        .pipe(plumber())
        .pipe(stripDebug())
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
// JS concat, strip debugging and minify
gulp.task('scripts', function() {
    return gulp.src(sourcesjs)
        .pipe(plumber())
        .pipe(concat(name+'.js'))
        .pipe(gulp.dest(jsTarget))
        .pipe(notify({
            title: 'scripts',
            message: 'concat - completed the work!'
        }))
        .pipe(uglify())
        .pipe(rename(name+'.min.js'))
        .pipe(gulp.dest(jsTarget))
        .pipe(notify({
            title: 'scripts',
            message: 'uglify - completed the work!'
        }));
});



// minify new or changed HTML pages
gulp.task('htmlpage', function() {
    gulp.src(htmlSource)
      // .pipe(changed(htmlDst))
       // .pipe(minifyHTML())
        .pipe(gulp.dest(htmlTarget))
        .pipe(notify({
            title: 'html',
            message: 'html-completed the work!'
    }));
});

// CSS concat, auto-prefix and minify
gulp.task('sass', function() {
    gulp.src(sassSource)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
           errLogToConsole: true
        }).on('error', sass.logError))
        //.pipe(prefix("last 2 version", "> 1%"))
        .pipe(rename(name+'.css'))
        .pipe(gulp.dest(cssTarget))
        .pipe(minifycss())
        .pipe(rename(name+'.min.css'))
        .pipe(sourcemaps.write())
        .pipe(notify({
            title: 'sass',
            message: 'DONE!'
        }))
        .pipe(gulp.dest(cssTarget));
});

// default gulp task
gulp.task('default', ['clean','copyfont','htmlpage','sass', 'jshint','scripts']);
// default gulp task
gulp.task('watch', function() {
    gulp.watch('./src/scripts/*.js', ['jshint','scripts']);
    gulp.watch('./src/sass/{,*/}*.{scss,sass}', ['sass']);
    gulp.watch('./src/htmlpage/**/*', ['htmlpage']);
});





