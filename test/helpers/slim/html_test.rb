def html_test(polymer_element_path)
  <<-html
  <!DOCTYPE html>
  <html>
    <head>
      <title>
        #{polymer_element_path}
      </title>

      <script src="../../../../bower_components/polymer/polymer.min.js"></script>
      <script src="../../../../vendor/polymer-tools-test/htmltest.js"></script>
      <script src="../../../../vendor/polymer-tools-test/chai/chai.js"></script>
      <script src="../../../../vendor/sinon-chai/sinon-chai.js"></script>
      <script src="../../../../vendor/sinon/sinon.js"></script>

      <!-- import polymer-element to be tested -->
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

    <t-test></t-test>

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
