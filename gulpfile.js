'use strict';

const build = require('@microsoft/sp-build-web');
const gulp = require('gulp');
const notify = require('gulp-notify');
const webpack = require('webpack');

// ✅ تجاهل تحذيرات CSS
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// ✅ استبدال مهمة serve بالنسخة القديمة (أسرع غالبًا)
const getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  const result = getTasks.call(build.rig);
  result.set('serve', result.get('serve-deprecated'));
  return result;
};

// ✅ إشعار عند انتهاء الـ rebuild (مع تجاهل أول مرة)
let isFirstBuild = true;

function showRebuildNotification() {
  // إشعار النظام
  return gulp.src('package.json')
    .pipe(notify({
      title: 'Rebuild Complete',
      message: 'changes have been saved successfully!',
      sound: true,
      onLast: true
    }));
}

// ✅ تقليل زمن البناء: إلغاء sourcemaps
build.sass.setConfig({
  sourceMap: false
});

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {

    // تعطيل sourcemaps لملفات JS/TS
    generatedConfiguration.devtool = false;

    // تعريف NODE_ENV لو محتاجاه في الكود
    generatedConfiguration.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development')
        }
      })
    );

    // إشعار بعد الـ build (مع تخطي أول مرة)
    generatedConfiguration.plugins.push({
      apply: (compiler) => {
        compiler.hooks.done.tap('NotificationPlugin', (stats) => {
          if (!stats.hasErrors()) {
            if (!isFirstBuild) {
              setTimeout(() => {
                showRebuildNotification();
              }, 100);
            }
            isFirstBuild = false;
          }
        });
      }
    });

    return generatedConfiguration;
  }
});

// ✅ بدء عملية الـ build
build.initialize(gulp);


















// 'use strict';

// const build = require('@microsoft/sp-build-web');

// build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// var getTasks = build.rig.getTasks;
// build.rig.getTasks = function () {
//   var result = getTasks.call(build.rig);

//   result.set('serve', result.get('serve-deprecated'));

//   return result;
// };

// build.initialize(require('gulp'));
