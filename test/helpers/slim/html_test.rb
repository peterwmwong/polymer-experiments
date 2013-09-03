def html_test(polymer_element_path)
  <<-html
  <!DOCTYPE html>
  <html>
    <head>
      <title>
        #{polymer_element_path}
      </title>

      <script src="../../../../vendor/polymer-all/polymer/polymer.js"></script>
      <script src="../../../../vendor/polymer-tools-test/htmltest.js"></script>
      <script src="../../../../vendor/polymer-tools-test/chai/chai.js"></script>
      <link href="../../../../build/#{polymer_element_path}" rel="import" />

      <script>
      (function(){
        window.assert = chai.assert;
        window.expect = chai.expect;
        var callback;
        window.ready = function(cb){ callback = cb; };
        addEventListener('WebComponentsReady', function(){
          callback && callback();
        });
      })();
      </script>
    </head>

    <body>

    #{yield}

    <!-- Add Livereload only if the test is running standalone -->
    <script type="text/javascript">
    if (window.top === window) {
      document.write(
        '<script src="http://' +
          (location.host || 'localhost').split(':')[0] +
          ':35729/livereload.js?snipver=1"></' +
          'script>'
      );
    }
    </script>

    </body>
  </html>
  html
end