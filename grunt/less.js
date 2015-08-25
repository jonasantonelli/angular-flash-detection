'use strict';

// Compilação do LESS
module.exports = function(grunt) {


    return {
        options: {
            strictMath: true,
            cleancss: true
        },

        app: {
            src: '<%= pkg.application.src.less %>/**/*.less',
            dest: '<%= pkg.application.published.css %>/<%= pkg.application.name %>.css'
        }
     
    };
};