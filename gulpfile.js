const { watch } = require('gulp');
const child_proc = require('child_process');

gulp.task('default', ['runServer', 'watchForChanges']);

gulp.task('watchForChanges', )

function messageMe(cb) {
console.log("Change Made");
cb();
}

watch('./*.js', {delay: 1}, messageMe);