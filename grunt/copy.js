'use strict';

//Copiar os arquivos
module.exports = {

	less: {
		src: '<%= pkg.assets.config.less %>/<%=pkg.assets.config.name %>.less',
		dest: '<%= pkg.source %>/<%=pkg.assets.config.name %>.less',
	},

	js: {
		src: '<%= pkg.assets.config.application %>/<%=pkg.assets.config.name %>.js',
		dest: '<%= pkg.source %>/<%=pkg.assets.config.name %>.js',
	}
	
};