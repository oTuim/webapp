/*  
    By Bill Rocha <https://billrocha.netlify.com>

	*** This script requires Babel & Gulp 4 or later *** 
    Before using, install the latest version of GULP-CLI and the necessary plugins:

    npm i --save-dev @babel/cli @babel/core @babel/polyfill @babel/preset-env @babel/register gulp@4 gulp-concat gulp-if gulp-babel gulp-javascript-obfuscator gulp-uglify uglify-es yargs gulp-header

    Add these lines to your package.js

    "babel": {
        "presets": [ "@babel/preset-env"]
	},
	

	Using:

	gulp [-pob]

	Options:
	-p = production mode (minified)	
	-o = obfuscated scripts	
	-b = use Babel (for oldies navigators)

	Both script and the service worker file will be mounted in the "/dist" directory

 */

'use strict'

import {gulp, series, parallel, src, dest} from 'gulp'
import babel from 'gulp-babel'
import gulpif from 'gulp-if'
import concat from 'gulp-concat'
import header from 'gulp-header'
import yargs from 'yargs'
import javascriptObfuscator from 'gulp-javascript-obfuscator'
import uglifyes from 'uglify-es'
import composer from 'gulp-uglify/composer'

const uglify = composer(uglifyes, console)
const argv = yargs.argv

// CONFIGURATION -------------------------------------------------------------- [CONFIG]

// args
let PRO = argv.p !== undefined // gulp -p (production mode)
let OBF = (argv.o || false) && PRO // gulp -o (obfuscator)
let BABEL = argv.b !== undefined // gulp -b (to run Babel)

// show config
console.log(
	'\n---------------------------------------------------\n    ' +
		(!PRO ? "DEVELOPMENT mode ['gulp -p' to production]" : 'PRODUCTION mode') +
		'\n---------------------------------------------------\n'
)

const vendor_aes = () =>
	src(['public/js/vendor/source/aes.js', 'public/js/vendor/source/pbkdf2.js', 'public/js/vendor/source/aesman.js'])
		.pipe(concat('aes.js'))
		.pipe(gulpif(PRO, uglify()))
		.pipe(dest('public/js/vendor'))

const vendor_rsa = () =>
	src(['public/js/vendor/source/jsbn.js', 'public/js/vendor/source/rsa.js'])
		.pipe(concat('rsa.js'))
		.pipe(gulpif(PRO, uglify()))
		.pipe(dest('public/js/vendor'))

const script = () =>
	src([
		// Vendors
		'public/js/vendor/aes.js',
		'public/js/vendor/rsa.js',

		// Helpers & Libraries
		'public/js/lib/function.js',
		'public/js/lib/util.js',
		'public/js/lib/lang.js',
		'public/js/lib/show.js',
		'public/js/lib/gate.js',

		// Controllers
		'public/js/ctrl/auth.js',
		'public/js/ctrl/home.js',

		// Main
		'public/js/main.js'
	])
		.pipe(gulpif(BABEL, babel()))
		.pipe(concat('script.js'))
		.pipe(gulpif(PRO, uglify()))
		.pipe(gulpif(OBF, javascriptObfuscator({compact: true, sourceMap: false})))
		.pipe(dest('public/js'))

const sw = () => {
	let VERSION = 'const VERSION="' + new Date().getTime() + (PRO ? '' : '-dev') + '";\r'
	let source = PRO
		? ['public/js/sw/file_pro.js', 'public/js/sw/sw.js']
		: ['public/js/sw/file.js', 'public/js/sw/sw.js']
	return src(source)
		.pipe(gulpif(BABEL, babel()))
		.pipe(concat('sw.js'))
		.pipe(header(VERSION))
		.pipe(gulpif(PRO, uglify()))
		.pipe(gulpif(OBF, javascriptObfuscator({compact: true, sourceMap: false})))
		.pipe(dest('public'))
}

// TASKs ----------------------------------------------------------- [TASKs]
exports.default = series(parallel(vendor_aes, vendor_rsa, sw), script) // gulp [-pob]
exports.aes = vendor_aes // gulp aes [-pob]
exports.rsa = vendor_rsa // gulp rsa [-pob]
exports.script = series(parallel(vendor_aes, vendor_rsa), script) // gulp script [-pob]
exports.sw = sw // gulp sw [-pob]
