#!/bin/sh

cd "$( cd `dirname $0` && pwd )/.."

npm install

node_modules/grunt/bin/grunt build
