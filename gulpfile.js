"use strict";

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');
const sequence = require('run-sequence');
const _glob = require('glob');
const co = require('co');
const childProcess = require('child_process');

const entry = './index.js';
const testDir = './test';
const testGlob = `${testDir}/*.spec.js`;
const perfDir = './perf';
const perfGlob = `${perfDir}/*.perf.js`;
const srcDir = './src';
const srcGlob = `${srcDir}/**/*.js`;

const glob = (path, options = {}) => new Promise((resolve, reject) => {
  return _glob(path, options, (err, data) => {
    if (err)
      return reject(err);
    return resolve(data);
  });
});

const spawn = (command, args = [], options = { stdio: 'inherit' }) => new Promise((resolve, reject) => {
  const child = childProcess.spawn(command, args, options);
  child.once('error', reject);
  child.once('close', resolve);
});

gulp.task('lint', () => {
  return gulp.src([ entry, srcGlob, testGlob, './gulpfile.js' ])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('test', () => {
  return gulp.src(testGlob)
    .pipe(mocha({
      reporter: 'spec'
    }));
});

gulp.task('watch', () => {
  gulp.watch([ entry, srcGlob, testGlob ], () => {
    return sequence('lint', 'test');
  });
});

gulp.task('perf', () => {
  return co(function*() {
    const files = yield glob(perfGlob);
    for (let file of files) {
      yield spawn('node', [ file ]);
    }
  });
});

gulp.task('default', done => {
  sequence(
      'lint'
    , 'test'
    , 'watch'
    , done
  );
});
