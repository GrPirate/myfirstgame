var gulp = require('gulp');
var concat = require('gulp-concat');
var order = require("gulp-order");


gulp.task("build", async function () {
  gulp.src(["out/core/**/*.js"]).pipe(order([
        "component/**/*.js",
        "tool/**/*.js",
        "global.js",
        "game.js"
    ])).pipe(concat('main.js')).pipe(gulp.dest('debug'));
});