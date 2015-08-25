'use strict';

// Autoprefixer dos CSS vendor
module.exports = {
    options: {
        livereload: true,
    },


    less: {
        files: '<%= pkg.application.src.less %>/**/*.less',
        tasks: ['less:app', 'autoprefixer:all', 'notify:less']
    },

    js: {
        files: '<%= pkg.application.src.js %>/**/*.js',
        tasks: ['concat:app', 'jshint:angular', 'notify:js']
    }

};