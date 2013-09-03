#!/usr/bin/env ruby

require 'slim'
require './test/helpers/slim/html_test.rb'
require './test/helpers/slim/generate_html_test_suites.rb'

puts ARGV[1]
input =
  if ARGV[1] 
    File.open(ARGV[1], 'r')
  else
    $stdin
  end

result = Slim::Template.new({pretty:true}){input.read}.render(Object.new)
File.open(ARGV[0], 'w').puts result
