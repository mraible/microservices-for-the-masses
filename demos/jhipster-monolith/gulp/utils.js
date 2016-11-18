'use strict';

var fs = require('fs');

module.exports = {
    endsWith : endsWith,
    parseVersion : parseVersion,
    isLintFixed : isLintFixed
};

function endsWith(str, suffix) {
    return str.indexOf('/', str.length - suffix.length) !== -1;
}

// Returns the second occurrence of the version number from `build.gradle` file
function parseVersion() {
    var versionRegex = /^version\s*=\s*[',"]([^',"]*)[',"]/gm; // Match and group the version number
    var buildGradle = fs.readFileSync('build.gradle', 'utf8');
    return versionRegex.exec(buildGradle)[1];
}

function isLintFixed(file) {
	// Has ESLint fixed the file contents?
	return file.eslint !== null && file.eslint.fixed;
}
