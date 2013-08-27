/*global module:false*/
module.exports = function(grunt) {

  var sourceDir = 'src/';
  var distDir = 'dist/';
  var extToTaskConfig = {
    coffee: {
      task: ['coffee','dist'],
      configFn: function(filepath) {
        return {
          options: {
            bare: true,
            sourceMap: true
          },
          expand: true,
          src: (filepath && stripSourceDir(filepath) || '**/*.coffee'),
          dest: distDir,
          ext: '.js',
          cwd: sourceDir
        };
      }
    },

    scss: {
      task: ['sass','dist'],
      configFn: function(filepath) {
        return {
          options: {
            sourcemap: true,
            loadPath: 'src/styles/mixins/'
          },
          expand: true,
          cwd: sourceDir,
          src: (filepath && stripSourceDir(filepath) || [
            'views/**/*.scss',
            '*.scss'
          ]),
          dest: distDir,
          ext: '.css'
        };
      }
    },

    slim: {
      task: ['slim','dist'],
      configFn: function(filepath) {
        return {
          options: {
            pretty: true
          },
          expand: true,
          cwd: sourceDir,
          src: (filepath && stripSourceDir(filepath) || ['**/*.slim']),
          dest: distDir,
          ext: '.html'
        };
      }
    }

  };
  function stripSourceDir(filepath) {
    return filepath.replace(new RegExp('^'+sourceDir),'');
  }

  grunt.initConfig({

    // Metadata
    // --------
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',


    // Tasks
    // -----
    coffee: {
      dist: extToTaskConfig.coffee.configFn()
    },

    sass: {
      dist: extToTaskConfig.scss.configFn()
    },

    slim: {
      dist: extToTaskConfig.slim.configFn()
    },

    watch: {
      coffee: {
        files: 'src/**/*.coffee',
        tasks: ['coffee:dist'],
        options: {
          livereload: true,
          spawn: false
        }
      },

      sass: {
        files: 'src/**/*.scss',
        tasks: ['sass:dist'],
        options: {
          livereload: true,
          spawn: false
        }
      },

      slim: {
        files: 'src/**/*.slim',
        tasks: ['slim:dist'],
        options: {
          livereload: true,
          spawn: false
        }
      }
    },

    connect: {
      server: {
        options: {
          hostname: '*',
          port: 3000,
          base: './'
        }
      }
    },

    exec: {
      vulcan: {
        command: 'node vendor/labs/vulcanize/vulcan.js -i dist/index.html -o dist/build.html -v',
        stdout: true,
        stderr: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-slim');

  // Only compile the changed file.
  // The task used compiled the changed file is determined by the
  // changed file's extension.
  grunt.event.on('watch', function(action, filepath) {
    var fileExt = /\.(\w+)$/.exec(filepath)[1];
    var taskConfig = extToTaskConfig[fileExt];

    grunt.config(taskConfig.task, taskConfig.configFn(filepath));
  });

  grunt.registerTask('default',[
    'coffee:dist',
    'sass:dist',
    'slim:dist'
  ]);

  grunt.registerTask('wcbuild',[
    'exec:vulcan'
  ]);
};
