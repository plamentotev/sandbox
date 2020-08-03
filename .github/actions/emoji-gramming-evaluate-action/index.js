const Program = require('./program.js');

const core = require('@actions/core');

try {
    const leaderboardFile = core.getInput('leaderboard');
    const input = core.getInput('input');
    const expectedOutput = core.getInput('expected-output');

    const user = core.getInput('user');
    const code = core.getInput('code');
    const solutionUrl = core.getInput('solution-url');

    let success = false;
    let feedback = '';
    let score = 0;

    // Evaluate the solution
    try {
        const program = new Program(code);

        score = program.commandsCount;
        const output = program.run(input);

        if (expectedOutput == output) {
            success = true;
            feedback = `Congratulations @${user}, your solution is correct.\n\nScore: ${score}`;
        } else {
            success = false;
            feedback = `Sorry @${user}, your solution exited normally, but the output differs from the expected.`;
        }
    } catch (e) {
        success = false;
        feedback = `Sorry @${user}, your solution exited with an error:\n\n>${e}`;
    }

    // Update the leaderboard
    if (success) {
        const leaderboard = JSON.parse(fs.readFileSync(leaderboardFile));

        let userEntry;
        for (const entry of leaderboard) {
            if (entry.user == user) {
                userEntry = entry;
                break;
            }
        }
        if (!userEntry) {
            userEntry = {
                user: user,
                score: score,
                solutionUrl: solutionUrl
            };
            leaderboard.push(userEntry);
        }

        if (userEntry.score > score) {
            userEntry.score = score;
        }

        leaderboard.sort((a, b) => a.score - b.score);
        fs.writeFileSync(leaderboardFile, JSON.stringify(leaderboard));
    }

    core.setOutput("success", success);
    core.setOutput("feedback", feedback);
} catch (error) {
    core.setFailed(error.message);
}
