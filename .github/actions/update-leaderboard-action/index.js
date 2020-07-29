const core = require('@actions/core');
const fs = require('fs');
const Mustache = require('mustache')

const leaderboardFile = core.getInput('leaderboard');
const user = core.getInput('user');
const score = Number(core.getInput('score'));
const templateFile = core.getInput('template');
const readmeFile = 'README.md';

const leaderboard = JSON.parse(fs.readFileSync(leaderboardFile));

let userEntry;
for (const entry of leaderboard) {
    if (entry.user == user) {
        userEntry = entry;
        break;
    }
}
if (!userEntry) {
    userEntry = { user: user, score: score };
    leaderboard.push(userEntry);
}

if (userEntry.score > score) {
    userEntry.score = score;
}

leaderboard.sort((a, b) => a.score - b.score);
fs.writeFileSync(leaderboardFile, JSON.stringify(leaderboard));

const template = fs.readFileSync(templateFile);
const readme = Mustache.render(template.toString(), { entries: leaderboard });
fs.writeFileSync(readmeFile, readme);
