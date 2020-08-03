const core = require('@actions/core');
const fs = require('fs');
const Mustache = require('mustache')

const leaderboardFile = core.getInput('leaderboard');
const templateFile = core.getInput('template');
const readmeFile = 'README.md';

const template = fs.readFileSync(templateFile);
const leaderboard = JSON.parse(fs.readFileSync(leaderboardFile));

const readme = Mustache.render(template.toString(), { entries: leaderboard });
fs.writeFileSync(readmeFile, readme);
