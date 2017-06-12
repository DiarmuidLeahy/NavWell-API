
'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      js: {
        files: ['controllers/{,*/}*.js', 'models/{,*/}*.js', 'config.js'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      all: []
    }
  });

  // Load the plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Default task
  grunt.registerTask('default', ['watch']);
};