module.exports = function (grunt) {
  grunt.initConfig({
    traceur: {
      options: {
        experimental: true
      },
      custom: {
        files: {
          'dist/app.js': 'src/**/*.js'
        }
      }
    },
    watch: {
      files: 'src/**/*.js',
      tasks: 'traceur'
    }
  });

  grunt.loadNpmTasks('grunt-traceur-latest');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
