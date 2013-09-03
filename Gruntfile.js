/*global module:false*/
module.exports = function(grunt) {

  var sourceDir = 'src/';
  var test_sourceDir = 'test/';

  var buildDir = 'build/';
  var test_buildDir = 'test_build/';


  // 
  // extToTaskConfig:object
  // ======================
  // 
  // Hash that maps file extension to grunt task specific config.
  // `getTaskConfigForFile()` merges this configuration with shared
  // configuration to create the final grunt task config.
  // 
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

  // 
  // getTaskConfigForFile(filepath):{task,config}
  // ============================================
  // 
  // Unifies grunt task configuration for coffee, sass, and slim files.
  // This consolidates the logic of merging shared configuration (expand, cwd,
  // src, and dest) with task specific configuration (see `extToTaskConfig`).
  // 
  // Based on the `filepath`, the proper configuration can be determined.
  // Here is an example return value with brief explanation of how each property
  // value is determined:
  // 
  //     {
  //       task: // Based on `filepath`'s extension and whether it's a test file
  //             // or not (base directory is 'src/' or 'test/'). See `extToTaskConfig`
  //             // for extension to task mapping.
  //             // ex. src/one.coffee -> ['coffee','build']
  //             // ex. test/one.coffee -> ['coffee','test_build']
  //             // ex. src/a.slim -> ['slim','build']
  //
  //       // Grunt task config
  //       config: {
  //
  //         ... // Mixed in task specific properties from `extToTaskConfig`
  // 
  //         expand: // true. Do NOT concatenated into one file
  //
  //         cwd: // 'src/' or 'test/' based on the `filepath` base directory
  //
  //         src: // Modified `filepath`, with base directory removed.
  //              // ex. src/one.coffee -> one.coffee
  //
  //         dest: // 'build/' or 'test_build/' based on the `filepath` base directory.
  //       }
  //     }
  // 
  function getTaskConfigForFile(filepath) {
    var filepaths = Array.isArray(filepath) ? filepath : [filepath];
    var isFromTest = /^test\//.test(filepaths[0]);
    var fileExt = /\.(\w+)$/.exec(filepaths[0])[1];
    var taskConfig = extToTaskConfig[fileExt];
    var config = {};

    // Mixin task specific properties
    Object.keys(taskConfig.config).forEach(function(key){
      config[key] = taskConfig.config[key];
    });

    config.expand = true;

    config.cwd = isFromTest ? test_sourceDir : sourceDir;

    // Make `filepath` relative to sourceDir (`src/` or `test/`)
    config.src = filepaths.map(function(path){
      return path.replace(new RegExp('^'+config.cwd),'');
    });

    config.dest = isFromTest ? test_buildDir : buildDir;

    return {
      task: [
        taskConfig.task,
        (isFromTest ? 'test_build' : 'build')
      ],
      config: config
    };
  }


  // 
  // getTaskConfigForFile(filepath):{task,config}
  // ============================================
  // 
  // Unifies grunt watch task configuration for coffee, sass, and slim files.
  // 
  // Based on the `filepath`, the proper configuration can be determined.
  // Here is an example return value with brief explanation of how each property
  // value is determined:
  // 
  //     // Grunt task config
  //     {
  //         files: // `filepath`
  //         tasks: // "#{task by file extension}:#{'build' or 'test_build'}"
  //         options: {
  //           livereload: // true. Enable Livereload
  //           spawn: // false. Do NOT spawn a new process for each compile. Makes
  //                  // compiles much faster.
  //         }
  //     }
  // 
  function getWatchTaskConfigForFile(filepath) {
    var filepaths = Array.isArray(filepath) ? filepath : [filepath];
    var isFromTest = /^test\//.test(filepaths[0]);
    var fileExt = /\.(\w+)$/.exec(filepaths[0])[1];
    var taskConfig = extToTaskConfig[fileExt];
    
    return {
      files: filepaths,
      tasks: [taskConfig.task + ':' + (isFromTest ? 'test_build' : 'build')],
      options: {
        livereload: true,
        spawn: false
      }
    }
  }

  grunt.initConfig({

    // Metadata
    // ========
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',


    // 
    // Compile Tasks for *.coffee, *.scss, and *.slim
    // ==============================================
    // 
    // 2 Tasks for each compile type for source and test files
    // 
    coffee: {
      build: getTaskConfigForFile( 'src/**/*.coffee' ).config,
      test_build: getTaskConfigForFile( 'test/**/*.coffee' ).config
    },

    sass: {
      build: getTaskConfigForFile( 'src/**/*.scss' ).config,
      test_build: getTaskConfigForFile( 'test/**/*.scss' ).config
    },

    slim: {
      build: getTaskConfigForFile( 'src/**/*.slim' ).config,
      test_build: getTaskConfigForFile( 'test/**/*.slim' ).config
    },

    watch: {

      // Source Watch Tasks
      // ==================
      coffee: getWatchTaskConfigForFile('src/**/*.coffee'),
      sass: getWatchTaskConfigForFile('src/**/*.scss'),
      slim: getWatchTaskConfigForFile('src/**/*.slim'),

      // Test Watch Tasks
      // ================
      test_coffee: getWatchTaskConfigForFile('test/**/*.coffee'),
      test_sass: getWatchTaskConfigForFile('test/**/*.scss'),
      test_slim: getWatchTaskConfigForFile('test/**/*.slim')
    },


    // Server Task
    // ===========
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

      // Production Build Task
      // =====================
      vulcan: {
        command: 'node vendor/labs/vulcanize/vulcan.js -i buid/index.html -o build/build.html -v',
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
  grunt.loadTasks('build_tasks/');

  // Only compile the changed file.
  // The task used compiled the changed file is determined by the
  // changed file's extension.
  grunt.event.on('watch', function(action, filepath) {
    var taskConfig = getTaskConfigForFile(filepath);
    grunt.config(taskConfig.task, taskConfig.config);
  });

  grunt.registerTask('default', [
    'coffee:build',
    'sass:build',
    'slim:build',
    'coffee:test_build',
    'sass:test_build',
    'slim:test_build'
  ]);

  grunt.registerTask('wcbuild', [
    'exec:vulcan'
  ]);

  grunt.registerTask('server', [
    'connect:server:keepalive'
  ]);
};
