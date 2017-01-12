///////////////////////////////////////////////////////////////////////////
//  Requires
//  Track number of reloads
//
//  Gulp Tasks
//  1. Vetting/Transpiling Tasks
//  1.1  Vet HTML
//  1.2  Process Sass
//  1.3  JavaScript
//  1.3.1  Vet JavaScript
//  1.3.2  Transpile ES6 
//  1.3.3  Run Unit Tests 
//  2. Staging Tasks
//  2.1  Clear Build directory
//  2.2  Move Html to build/ 
//  2.3  Minify and move Css to build/ 
//  2.4  Uglify and move JavaScript to build/ 
///////////////////////////////////////////////////////////////////////////

(function () {

  var gulp = require('gulp'),
    bsync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    babel = require('gulp-babel'),
    gutil = require('gulp-util'),
    gprint = require('gulp-print'),
    gif = require('gulp-if'),
    args = require('yargs').argv,
    htmlValidate = require('gulp-html-angular-validate'),
    fs = require('fs'),
    del = require('del'),
    reloadCount = 0,
    statsFile = './automation_stats.txt';


  ///////////////////////////////////////////////////////////////////////////
  // Track number of reloads for this project
  ///////////////////////////////////////////////////////////////////////////

  function fileExists(path) {
    try {
      return fs.statSync(path).isFile();
    } catch (err) {
      return false;
    }
  }

  function updateStatsFile() {
    fs.writeFileSync(statsFile, reloadCount);
  }

  function showStats() {
    console.log('** Reload Count : ' + reloadCount + ' **');
  }

  function reload() {
    bsync.reload();
    reloadCount++;
    updateStatsFile();
  }

  if (fileExists(statsFile)) {
    console.log('Stats File Exists...');
    reloadCount = parseInt(fs.readFileSync(statsFile, 'utf-8'));
  } else {
    console.log('Creating Stats File...');
    reloadCount = 0;
    fs.writeFileSync(statsFile, reloadCount);
  }
  showStats();


  ///////////////////////////////////////////////////////////////////////////
  // 1. Vetting/Transpiling Tasks
  ///////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////
  // 1.1 Vet HTML

  gulp.task('vetHtml', function() {
    var options = {
      customattrs: ['*'],
      customtags: ['*'],
      emitError: true,
      reportFn:function(fileFailures){
        for (var i = 0; i < fileFailures.length; i++) {
          var fileResult = fileFailures[i];
          gutil.log(gutil.colors.yellow.bold(fileResult.filepath));
          for (var j = 0; j < fileResult.errors.length; j++) {
            var err = fileResult.errors[j];
            if (err.line !== undefined) {
              gutil.log(gutil.colors.yellow('[line' +err.line +', col: ' + err.col +'] ') +err.msg);
            } else {
              gutil.log(err.msg);
            }
          }
        }
      }
    };
    gulp.src(['./src/*.html'])
      .pipe(htmlValidate(options));
  });

  gulp.task('vetHtml-refresh', ['vetHtml'], function() {
    reload();
    showStats();
  });


  ///////////////////////////////////////////////////////////////////////////
  // 1.2 Process Sass

  gulp.task('sass', function() {
    return gulp
      .src('./src/scss/**/*.scss')
      .pipe(sass({outputStyle:'expanded'}).on('error', sassErrorHandler))
      .pipe(gulp.dest('./src/css/'));
  });
  gulp.task('sass-refresh', ['sass'], function() {
    reload();
    showStats();
  });


  ///////////////////////////////////////////////////////////////////////////
  // 1.3 JavaScript
  
  ///////////////////////////////////////////////////////////////////////////
  // 1.3.1 Vet JavaScript

  gulp.task('vetjs', function() {
    return gulp
      .src([
        './*.js',
        './test/*.js',
        './src/js/*.js'
      ])
      .pipe(gif(!args.q, gprint()))
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
  });
  gulp.task('js-refresh', ['vetjs'], function() {
    reload();
    showStats();
  });

  
  ///////////////////////////////////////////////////////////////////////////
  // 1.3.2 Transpile ES6
  gulp.task('es625', function () { 
    gulp.src('src/es6/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
      .pipe(gulp.dest('src/js'));
  });
  gulp.task('es6-refresh', ['es625'], function() {
    reload();
    showStats();
  });



  ///////////////////////////////////////////////////////////////////////////
  // 2. Staging Tasks
  ///////////////////////////////////////////////////////////////////////////
 
  ///////////////////////////////////////////////////////////////////////////
  // 2.1 Clean build/ directory
  gulp.task('clean:build', function () {
    return del(['build/**', '!build']);
  });
  gulp.task('clean:html', function () {
    return del(['build/*.html']);
  });
  gulp.task('clean:css', function () {
    return del(['build/css/*.css']);
  });
  gulp.task('clean:js', function () {
    return del(['build/js/*.js']);
  });

  ///////////////////////////////////////////////////////////////////////////
  // 2.2 Move files to build/
  gulp.task('move:html', ['clean:html', 'vetHtml'], function() {
    return gulp.src('src/*.html')
      .pipe(gulp.dest('build/'));
  });
  gulp.task('move:css', ['clean:css', 'sass'], function() {
    return gulp.src('src/css/*.css')
      .pipe(gulp.dest('build/css/'));
  });
  gulp.task('move:js', ['clean:js', 'vetjs'], function() {
    return gulp.src('src/js/*.js')
      .pipe(gulp.dest('build/js/'));
  });
  gulp.task('move:lib', function() {
    return gulp.src('src/lib/**');
  });
  gulp.task('move:images', function() {
    return gulp.src('src/images/**');
  });

  gulp.task('stage', ['clean:build', 'move:html', 'move:css', 'move:js'], function () {

  });
  

  ///////////////////////////////////////////////////////////////////////////
  // Browser Sync Src
  ///////////////////////////////////////////////////////////////////////////

  gulp.task('bsync', ['vetHtml', 'sass', 'vetjs'], function() {
    bsync.init({
      server: {
        baseDir: './src/'
      }
    });
  });

  ///////////////////////////////////////////////////////////////////////////
  // Default Vetting/Transpiling Task

  gulp.task('default', ['bsync'], function() {
    gulp.watch(['./src/*.html', './*html'], ['vetHtml-refresh']);
    gulp.watch('./src/scss/**/*.scss', ['sass-refresh']);
    gulp.watch(['./src/es6/**/*.js'], ['es6-refresh']);
    gulp.watch(['./src/**/*.js', '!./src/es6/**/*.js', './*.js'], ['js-refresh']);
  });


  ///////////////////////////////////////////////////////////////////////////
  // Custom Functions
  ///////////////////////////////////////////////////////////////////////////

  function sassErrorHandler(err) {
    gutil.log(gutil.colors.red.underline('*** Sass Error ***\n') +
      gutil.colors.yellow.bold(err.message));
    this.emit('end');
  }

})();
