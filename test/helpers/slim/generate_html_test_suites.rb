# Generates the JS source for html suites and tests based on the files
# in the test/specs directory.  This saves us the trouble of maintaining test 
# suites in JS and enforces a good directory structure.
#
# As an example, consider directory and files...
#
#     test/
#       specs/
#         models/
#           m-todos/
#             basic.html
#             complex.html
#           m-user/
#             basic.html
#
# ... this function would generate the following...
#
#      htmlSuite("models/m-todos",function(){
#        htmlTest("models/m-todos/basic.html");
#        htmlTest("models/m-todos/complex.html");
#      });
#
#      htmlSuite("models/m-user",function(){
#        htmlTest("models/m-user/basic.html");
#      });
def generate_html_test_suites

  # 1. Find all html test files
  # 2. Re-base path to 'test/specs'
  # 3. Change the file extension to rendered extension (slim -> html)
  grouped_html_test_files = Dir.glob("test/specs/**/*.slim").map do |file|
    file.gsub!('test/specs/','').gsub('.slim','.html')
  end

  # Group html tests by directory
  grouped_html_test_files = grouped_html_test_files.group_by do |file|
    File.dirname file
  end

  # Render JS source
  result = "<script type='text/javascript'>\n"

  # For each group: htmlSuite(...)
  result += grouped_html_test_files.map do |group, html_tests|
    suite_source = "htmlSuite('#{group}', function(){\n"

    # For each html test: htmlTest(...)
    suite_source += 
      html_tests.map { |htmlfile| "  htmlTest('#{htmlfile}');"}.join '\n'
    suite_source + "\n});"
  end.join("\n")
  
  result + "\n</script>"
end