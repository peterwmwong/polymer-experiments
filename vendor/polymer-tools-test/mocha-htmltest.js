/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {
  var thisFile = 'lib/mocha-htmltest.js';
  var base = '';

  mocha.htmlbase = function(htmlbase) {
    base = htmlbase;
  };

  (function() {
    var s$ = document.querySelectorAll('script[src]');
    Array.prototype.forEach.call(s$, function(s) {
      var src = s.getAttribute('src');
      var re = new RegExp(thisFile + '[^\\\\]*');
      var match = src.match(re);
      if (match) {
        base = src.slice(0, -match[0].length);
      }
    });
  })();

  var next, iframe;

  var listener = function(event) {
    if (event.data === 'ok') {
      next();
    } else if (event.data && event.data.error) {
      // errors cannot be cloned via postMessage according to spec, so we re-errorify them
      throw new Error(event.data.error);
    }
  };

  function htmlSetup() {
    window.addEventListener("message", listener);
    iframe = document.createElement('iframe');
    iframe.style.cssText = 'position: absolute; left: -9000em; width:768px; height: 1024px';
    document.body.appendChild(iframe);
  }

  function htmlTeardown() {
    window.removeEventListener('message', listener);
    document.body.removeChild(iframe);
  }

  function getHTMLTestURL(src) {
    var url = base + src;
    var delimiter = url.indexOf('?') < 0 ? '?' : '&';
    var docSearch = location.search.slice(1);
    return '../specs/'+url + delimiter + Math.random() + '&' + docSearch;
  }

  function runHTMLTest(done, src) {
    next = done;
    iframe.src = getHTMLTestURL(src);
  }

  function htmlTest(src) {
    // Create a better Mocha test description.
    // Mocha shows the `@toString()` of the test function.  For html tests, the 
    // the test function is actually in the HTML file being iframed.  For right
    // now, the description shows a comment pointing to the test HTML file.
    // TODO: Improve html test description...
    //       1. Get the HTML string from `src` (overcome async retrieval issues)
    //       2. Make Mocha format description with HTML syntax (instead of JS)
    var testfn = function (done){
      runHTMLTest(done, src);
    };
    testfn.toString = function(){
      return "http://"+window.location.host+"/test_build/specs/"+src;
    };
    test(src, testfn);
  };

  function htmlSuite(inName, inFn) {
    suite(inName, function() {
      setup(htmlSetup);
      teardown(htmlTeardown);
      inFn();
    });
  };

  window.htmlTest = htmlTest;
  window.htmlSuite = htmlSuite;
})();
