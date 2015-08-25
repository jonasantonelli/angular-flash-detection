'use strict';

// Juntar os arquivos JS
module.exports = {
    options: {
        stripBanners: true,
        separator: ';'
    },

    app: {
        src:'<%= pkg.application.src.js %>/**/*.js',
        dest: '<%= pkg.application.published.js%>/application.js'
    }
};