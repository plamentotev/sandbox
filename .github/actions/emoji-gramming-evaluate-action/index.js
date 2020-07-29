const Program = require('./program.js');

const core = require('@actions/core');

try {
    const code = core.getInput('code');
    const input = core.getInput('input');

    let success = true;
    let output = '';
    let commandsCount = 0;

    try {
        const program = new Program(code);

        commandsCount = program.commandsCount;
        output = program.run(input);
    } catch (e) {
        success = false;
        output = e.toString();
    }

    core.setOutput("success", success);
    core.setOutput("output", output);
    core.setOutput("commands-count", commandsCount);
} catch (error) {
    core.setFailed(error.message);
}
