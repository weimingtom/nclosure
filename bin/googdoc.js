#!/usr/local/bin/node

/**
 * @fileoverview Copyright 2011 Guido Tapia (guido@tapia.com.au).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require('goog').goog.init();

goog.provide('node.goog.googdoc');

goog.require('goog.array');

goog.require('node.goog.utils');



/**
 * @constructor
 */
node.goog.googdoc = function() {
  var args = node.goog.utils.readSettingObject();
  if (!args.jsdocToolkitDir) {
    throw new Error('To run the jsdoc-toolkit documentation module please ' +
        'specify a jsdocToolkitDir property pointing to the jsdoc-toolkit ' +
        'root directory.  This setting can reside in the global closure.json ' +
        'settings file or the closure.json file in the code root dir');
  }

  this.init_(args, process.argv[2]);
};


/**
 * @private
 * @param {node.goog.opts} args The settings object.
 * @param {string} entryPoint The file/directory to document.
 */
node.goog.googdoc.prototype.init_ = function(args, entryPoint) {
  var entryPointDirIdx = entryPoint.lastIndexOf('/');
  var title = entryPointDirIdx > 0 ?
      entryPoint.substring(entryPointDirIdx + 1) : entryPoint;
  var entryPointDir = entryPointDirIdx > 0 ?
      entryPoint.substring(0, entryPointDirIdx) : '.';
  var jsDocToolkitDir = args.jsdocToolkitDir;

  var javaArgs = [
    '-jar',
    node.goog.utils.getPath(jsDocToolkitDir, 'jsrun.jar'),
    node.goog.utils.getPath(jsDocToolkitDir, 'app/run.js'),
    '-t=' +
        node.goog.utils.getPath(jsDocToolkitDir, 'templates/codeview'),
    '-d=' + node.goog.utils.getPath(entryPointDir, '/docs'),
    '-E=\.min\.js', '-E=deps\.js', '-E=/docs', '-D="title:' + title + '"'
  ];
  if (args.additionalJSDocToolkitOptions) {
    javaArgs = goog.array.concat(javaArgs, args.additionalJSDocToolkitOptions);
  }
  javaArgs.push(entryPoint);

  /** @type {extern_process} */
  var jsdoc = require('child_process').exec('java ' + javaArgs.join(' '),
      function(err, stdout, stderr) {
        if (err) throw err;
        if (stderr) console.error(stderr);
        if (stdout) console.log(stdout);
      });
};

new node.goog.googdoc();
