/*******************************
    Internal Task Collection
*******************************/

/* These tasks create packaged files from **dist** components
   Not intended to be called directly by a user because
   these do not build fresh from **src**
*/

module.exports = function(gulp) {

  var
    // node dependencies
    fs         = require('fs'),
    chmod      = require('gulp-chmod'),
    concat     = require('gulp-concat'),
    concatCSS  = require('gulp-concat-css'),
    clone      = require('gulp-clone'),
    dedupe     = require('gulp-dedupe'),
    gulpif     = require('gulp-if'),
    header     = require('gulp-header'),
    less       = require('gulp-less'),
    minifyCSS  = require('gulp-minify-css'),
    plumber    = require('gulp-plumber'),
    print      = require('gulp-print'),
    rename     = require('gulp-rename'),
    replace    = require('gulp-replace'),
    uglify     = require('gulp-uglify'),

    uncss      = require('gulp-uncss'),

    // user config
    config     = require('./../config/user'),
    docsConfig = require('./../config/docs'),

    // install config
    tasks      = require('./../config/tasks'),
    release    = require('./../config/project/release'),

    // shorthand
    globs      = config.globs,
    assets     = config.paths.assets,
    output     = config.paths.output,

    banner     = tasks.banner,
    filenames  = tasks.filenames,
    log        = tasks.log,
    settings   = tasks.settings
  ;

  /*--------------
      Packaged
  ---------------*/

  gulp.task('package uncompressed css', function() {
    return gulp.src(output.uncompressed + '/**/' + globs.components + globs.ignored + '.css')
      .pipe(plumber())
      .pipe(dedupe())
      .pipe(replace(assets.uncompressed, assets.packaged))
      .pipe(concatCSS(filenames.concatenatedCSS))
        .pipe(gulpif(config.hasPermission, chmod(config.permission)))
        .pipe(header(banner, settings.header))
        .pipe(gulp.dest(output.packaged))
        .pipe(print(log.created))
    ;
  });

  gulp.task('package compressed css', function() {
    return gulp.src(output.uncompressed + '/**/' + globs.components + globs.ignored + '.css')
      .pipe(plumber())
      .pipe(dedupe())
      .pipe(replace(assets.uncompressed, assets.packaged))
      .pipe(concatCSS(filenames.concatenatedMinifiedCSS))
        .pipe(gulpif(config.hasPermission, chmod(config.permission)))
        //.pipe(minifyCSS(settings.concatMinify))
        .pipe(uncss({
          html: [output.packaged + '/../../_site/**/*.html'],
          ignore: [/[a-zA-Z.\[\]\*\=\"\>\(\)\:\,]*.loading[a-zA-Z.\[\]\*\=\"\>\(\)\:\,\n\s]*/g,
                  '.transition[class*="slide down"].in',
                  '.transition[class*="slide down"].out',
                  '.scale.transition.in',
                  '.scale.transition.out',
                  '.transition.fade.in',
                  '.transition.fade.out',
                  /[a-zA-Z.\[\]\*\=\"\>\(\)\:\,]*.transition[a-zA-Z.\[\]\*\=\"\>\(\)\:\,\n\s]*/g,
                  /[a-zA-Z.\[\]\*\=\"\>\(\)\:\,]*.dimmer[a-zA-Z.\[\]\*\=\"\>\(\)\:\,\n\s]*/g,
                  /[a-zA-Z.\[\]\*\=\"\>\(\)\:\,]*.modal[a-zA-Z.\[\]\*\=\"\>\(\)\:\,\n\s]*/g,
                  /[a-zA-Z.\[\]\*\=\"\>\(\)\:\,]*.input[a-zA-Z.\[\]\*\=\"\>\(\)\:\,\n\s]*/g,
                  /[a-zA-Z.\[\]\*\=\"\>\(\)\:\,]*.dropdown[a-zA-Z.\[\]\*\=\"\>\(\)\:\,\n\s]*/g,
                  '.ui.form.error', '.field.error', '.ui.dropdown.error',
                  /[a-zA-Z.\[\]\*\=\"\>\(\)\:\,]*.upward[a-zA-Z.\[\]\*\=\"\>\(\)\:\,\n\s]*/g,
                  /[a-zA-Z.\[\]\*\=\"\>\(\)\:\,]*.fields[a-zA-Z.\[\]\*\=\"\>\(\)\:\,\n\s]*/g,
                  /[a-zA-Z.\[\]\*\=\"\>\(\)\:\,]*.search[a-zA-Z.\[\]\*\=\"\>\(\)\:\,\n\s]*/g,
                  /[a-zA-Z.\[\]\*\=\"\>\(\)\:\,]*.menu[a-zA-Z.\[\]\*\=\"\>\(\)\:\,\n\s]*/g,
                  /[a-zA-Z.\[\]\*\=\"\>\(\)\:\,]*.selected[a-zA-Z.\[\]\*\=\"\>\(\)\:\,\n\s]*/g,
                  /[a-zA-Z.\[\]\*\=\"\>\(\)\:\,]*.active[a-zA-Z.\[\]\*\=\"\>\(\)\:\,\n\s]*/g,
                  '.item', '.item.filtered', '.text.filtered', '.ui.dropdown .filtered.item',
                  '.ui.dropdown .menu .active.item', '.ui.dropdown .menu .selected.item, .ui.dropdown.selected', '.ui.selection.dropdown .menu>.item' ],
        }))
        .pipe(minifyCSS(settings.concatMinify))
        .pipe(header(banner, settings.header))
        .pipe(gulp.dest(output.packaged))
        .pipe(print(log.created))
    ;
  });

  gulp.task('package uncompressed js', function() {
    return gulp.src(output.uncompressed + '/**/' + globs.components + globs.ignored + '.js')
      .pipe(plumber())
      .pipe(dedupe())
      .pipe(replace(assets.uncompressed, assets.packaged))
      .pipe(concat(filenames.concatenatedJS))
        .pipe(header(banner, settings.header))
        .pipe(gulpif(config.hasPermission, chmod(config.permission)))
        .pipe(gulp.dest(output.packaged))
        .pipe(print(log.created))
    ;
  });

  gulp.task('package compressed js', function() {
    return gulp.src(output.uncompressed + '/**/' + globs.components + globs.ignored + '.js')
      .pipe(plumber())
      .pipe(dedupe())
      .pipe(replace(assets.uncompressed, assets.packaged))
      .pipe(concat(filenames.concatenatedMinifiedJS))
        .pipe(uglify(settings.concatUglify))
        .pipe(header(banner, settings.header))
        .pipe(gulpif(config.hasPermission, chmod(config.permission)))
        .pipe(gulp.dest(output.packaged))
        .pipe(print(log.created))
    ;
  });

  /*--------------
        RTL
  ---------------*/

  if(config.rtl) {

    gulp.task('package uncompressed rtl css', function () {
      return gulp.src(output.uncompressed + '/**/' + globs.components + globs.ignoredRTL + '.rtl.css')
        .pipe(dedupe())
        .pipe(replace(assets.uncompressed, assets.packaged))
        .pipe(concatCSS(filenames.concatenatedRTLCSS))
          .pipe(gulpif(config.hasPermission, chmod(config.permission)))
          .pipe(header(banner, settings.header))
          .pipe(gulp.dest(output.packaged))
          .pipe(print(log.created))
      ;
    });

    gulp.task('package compressed rtl css', function () {
      return gulp.src(output.uncompressed + '/**/' + globs.components + globs.ignoredRTL + '.rtl.css')
        .pipe(dedupe())
        .pipe(replace(assets.uncompressed, assets.packaged))
        .pipe(concatCSS(filenames.concatenatedMinifiedRTLCSS))
          .pipe(gulpif(config.hasPermission, chmod(config.permission)))
          .pipe(minifyCSS(settings.concatMinify))
          .pipe(header(banner, settings.header))
          .pipe(gulp.dest(output.packaged))
          .pipe(print(log.created))
      ;
    });

    gulp.task('package uncompressed docs css', function() {
      return gulp.src(output.uncompressed + '/**/' + globs.components + globs.ignored + '.css')
        .pipe(dedupe())
        .pipe(plumber())
        .pipe(replace(assets.uncompressed, assets.packaged))
        .pipe(concatCSS(filenames.concatenatedCSS))
          .pipe(gulpif(config.hasPermission, chmod(config.permission)))
          .pipe(gulp.dest(output.packaged))
          .pipe(print(log.created))
      ;
    });

    gulp.task('package compressed docs css', function() {
      return gulp.src(output.uncompressed + '/**/' + globs.components + globs.ignored + '.css')
        .pipe(dedupe())
        .pipe(plumber())
        .pipe(replace(assets.uncompressed, assets.packaged))
        .pipe(concatCSS(filenames.concatenatedMinifiedCSS))
          .pipe(minifyCSS(settings.concatMinify))
          .pipe(header(banner, settings.header))
          .pipe(gulpif(config.hasPermission, chmod(config.permission)))
          .pipe(gulp.dest(output.packaged))
          .pipe(print(log.created))
      ;
    });

  }

  /*--------------
        Docs
  ---------------*/

  var
    docsOutput = docsConfig.paths.output
  ;

  gulp.task('package uncompressed docs css', function() {
    return gulp.src(docsOutput.uncompressed + '/**/' + globs.components + globs.ignored + '.css')
      .pipe(dedupe())
      .pipe(plumber())
      .pipe(replace(assets.uncompressed, assets.packaged))
      .pipe(concatCSS(filenames.concatenatedCSS))
        .pipe(gulpif(config.hasPermission, chmod(config.permission)))
        .pipe(gulp.dest(docsOutput.packaged))
        .pipe(print(log.created))
    ;
  });

  gulp.task('package compressed docs css', function() {
    return gulp.src(docsOutput.uncompressed + '/**/' + globs.components + globs.ignored + '.css')
      .pipe(dedupe())
      .pipe(plumber())
      .pipe(replace(assets.uncompressed, assets.packaged))
      .pipe(concatCSS(filenames.concatenatedMinifiedCSS))
        .pipe(minifyCSS(settings.concatMinify))
        .pipe(header(banner, settings.header))
        .pipe(gulpif(config.hasPermission, chmod(config.permission)))
        .pipe(gulp.dest(docsOutput.packaged))
        .pipe(print(log.created))
    ;
  });

  gulp.task('package uncompressed docs js', function() {
    return gulp.src(docsOutput.uncompressed + '/**/' + globs.components + globs.ignored + '.js')
      .pipe(dedupe())
      .pipe(plumber())
      .pipe(replace(assets.uncompressed, assets.packaged))
      .pipe(concat(filenames.concatenatedJS))
        .pipe(header(banner, settings.header))
        .pipe(gulpif(config.hasPermission, chmod(config.permission)))
        .pipe(gulp.dest(docsOutput.packaged))
        .pipe(print(log.created))
    ;
  });

  gulp.task('package compressed docs js', function() {
    return gulp.src(docsOutput.uncompressed + '/**/' + globs.components + globs.ignored + '.js')
      .pipe(dedupe())
      .pipe(plumber())
      .pipe(replace(assets.uncompressed, assets.packaged))
      .pipe(concat(filenames.concatenatedMinifiedJS))
        .pipe(uglify(settings.concatUglify))
        .pipe(header(banner, settings.header))
        .pipe(gulpif(config.hasPermission, chmod(config.permission)))
        .pipe(gulp.dest(docsOutput.packaged))
        .pipe(print(log.created))
    ;
  });

};
