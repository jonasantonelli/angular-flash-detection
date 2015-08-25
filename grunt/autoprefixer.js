'use strict';

// Autoprefixer dos CSS vendor
module.exports = {
    options: {
        browsers: ['last 2 version', 'ie 8', 'ie 9']
    },

    all: {
        flatten: true,
        expand: true,
        src: '<%= pkg.application.published.css %>/*.css',
        dest: '<%= pkg.application.published.css %>/'
    }
};