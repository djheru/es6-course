module.exports = function (grunt) {
  grunt.initConfig({
    traceur: {
      options: {
        experimental: true
      },
      custom: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: ['*.js'],
            dest: 'dist'
          }
        ]
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
