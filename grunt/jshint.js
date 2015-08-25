'use strict';

// JSHint - Qualidade do código
module.exports = {
    options: {
        jshintrc: '.jshintrc'
    },
    
    // AngularJS
    angular: [
        '<%= pkg.application.src.js%>/**/*.js'
    ],


    Gruntfile: 'Gruntfile.js'
};