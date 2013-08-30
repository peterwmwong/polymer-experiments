/*global module:false*/
module.exports = function(grunt) {

  var sourceDir = 'src/';
  var test_sourceDir = 'test/';

  // TODO: rename buildDir:build/ and test_buildDir:test_build/
  var distDir = 'dist/';
  var test_distDir = 'test_build/';

  var extToTaskConfig = {
    coffee: {
      task: 'coffee',
      config: {
        ext: '.js',
        options: {
          bare: true,
          sourceMap: true
        }
      }
    },

    scss: {
      task: 'sass',
      config: {
        ext: '.css',
        options: {
          sourcemap: true,
          loadPath: 'src/styles/mixins/'
        }
      }
    },

    slim: {
      task: 'slim',
      config: {
        ext: '.html',
        options: {
          pretty: true
        }
      }
    }
  };

  // Based on the filepath's base directory and extension, determine...
  // 1) task
  // 2) config
  function getTaskConfigForFile(filepath) {
    var filepaths = Array.isArray(filepath) ? filepath : [filepath];
    var isFromTest = /^test\//.test(filepaths[0]);
    var fileExt = /\.(\w+)$/.exec(filepaths[0])[1];
    var taskConfig = extToTaskConfig[fileExt];

    // Make filepath relative to sourceDir
    filepaths = filepaths.map(function(path){
      return path.replace(new RegExp('^'+sourceDir),'');
    });

    var config = {};
    Object.keys(taskConfig.config).forEach(function(key){
      config[key] = taskConfig.config[key];
    });
    
    config.expand = true;
    config.cwd = isFromTest ? test_sourceDir : sourceDir;
    config.src = filepaths;
    config.dest = isFromTest ? test_distDir : distDir;

    return {
      task: [
        taskConfig.task,
        (isFromTest ? 'test_dist' : 'dist')
      ],
      config: config
    };
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
      dist: getTaskConfigForFile( 'src/**/*.coffee' ).config,
      test_dist: getTaskConfigForFile( 'test/**/*.coffee' ).config
    },

    sass: {
      dist: getTaskConfigForFile( 'src/**/*.scss' ).config,
      test_dist: getTaskConfigForFile( 'test/**/*.scss' ).config
    },

    slim: {
      dist: getTaskConfigForFile( 'src/**/*.slim' ).config,
      test_dist: getTaskConfigForFile( 'test/**/*.slim' ).config
    },

    watch: {
      coffee: {
        files: ['src/**/*.coffee','test/**/*.coffee'],
        tasks: ['coffee:dist'],
        options: {
          livereload: true,
          spawn: false
        }
      },

      sass: {
        files: ['src/**/*.scss','test/**/*.scss'],
        tasks: ['sass:dist'],
        options: {
          livereload: true,
          spawn: false
        }
      },

      slim: {
        files: ['src/**/*.slim','test/**/*.slim'],
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
    var taskConfig = getTaskConfigForFile(filepath);
    grunt.config(taskConfig.task, taskConfig.config);
  });

  grunt.registerTask('default', [
    'coffee:dist',
    'sass:dist',
    'slim:dist'
  ]);

  grunt.registerTask('wcbuild', [
    'exec:vulcan'
  ]);
};
