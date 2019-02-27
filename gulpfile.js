var gulp = require('gulp');
var concat = require('gulp-concat');
var order = require("gulp-order");


gulp.task("build", async function () {
  gulp.src(["out/core/**/*.js"]).pipe(order([
        "global.js",
        "game.js"
    ])).pipe(concat('main.js')).pipe(gulp.dest('debug'));
});