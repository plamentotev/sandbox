const MAX_COMMANDS = 1024;
const MAX_OUTPUT_LEN = 1024;
const MAX_EXECUTION_TIME = 10000;

const SET_COMMAND = '\uD83D\uDE0A'; // :blush:
const ADD_COMMAND = '\uD83D\uDE07'; // :innocent:
const SUBTRACT_COMMAND = '\uD83D\uDE08'; // :smiling_imp:
const IF_COMMAND = '\uD83D\uDE35'; // :dizzy_face:
const NO_OP_COMMAND = '';

const INSTRUCTION_COUNTER = '\uD83D\uDEA8'; // :rotating_light:
const INPUT_STREAM = '\uD83C\uDFA4'; // :microphone:
const OUTPUT_STREAM = '\uD83D\uDCE2'; // :loudspeaker:

const CONST_0 = '\uD83D\uDC94'; // :broken_heart:
const CONST_1 = '\uD83D\uDC9C'; // :purple_heart:
const CONST_2 = '\uD83D\uDC95'; // :two_hearts:
const CONST_4 = '\uD83D\uDC9E'; // :revolving_hearts:
const CONST_8 = '\uD83D\uDC96'; // :sparkling_heart:

const VAR_1 = '\u2648'; // :aries:
const VAR_2 = '\u2649'; // :taurus:
const VAR_3 = '\u264A'; // :gemini:
const VAR_4 = '\u264B'; // :cancer:
const VAR_5 = '\u264C'; // :leo:
const VAR_6 = '\u264D'; // :virgo:
const VAR_7 = '\u264E'; // :libra:
const VAR_8 = '\u264F'; // :scorpius:
const VAR_9 = '\u2650'; // :sagittarius:
const VAR_10 = '\u2651'; // :capricorn:
const VAR_11 = '\u2652'; // :aquarius:
const VAR_12 = '\u2653'; // :pisces:

const VAR_13 = '\uD83D\uDD50'; // :clock1:
const VAR_14 = '\uD83D\uDD51'; // :clock2:
const VAR_15 = '\uD83D\uDD52'; // :clock3:
const VAR_16 = '\uD83D\uDD53'; // :clock4:
const VAR_17 = '\uD83D\uDD54'; // :clock5:
const VAR_18 = '\uD83D\uDD55'; // :clock6:
const VAR_19 = '\uD83D\uDD56'; // :clock7:
const VAR_20 = '\uD83D\uDD57'; // :clock8:
const VAR_21 = '\uD83D\uDD58'; // :clock9:
const VAR_22 = '\uD83D\uDD59'; // :clock10:
const VAR_23 = '\uD83D\uDD5A'; // :clock11:
const VAR_24 = '\uD83D\uDD5B'; // :clock12:

class Variable {

    constructor() {
        this._value = 0;
    }

    get value() {
        return this._value;
    }

    get io() {
        return false;
    }

    reset() {
        this._value = 0;
    }

    set(value) {
        this._value = value;
    }

    add(num) {
        this._value += num;
    }

    subtract(num) {
        this._value -= num;
    }

}

class Constant {

    constructor(value) {
        this._value = value;
    }

    get value() {
        return this._value;
    }

    get io() {
        return false;
    }

    reset() {
        // Do nothing. Constants are... well, constant and do not change.
    }

    set(value) {
        throw "Could not modify constants.";
    }

    add(num) {
        throw "Could not modify constants.";
    }

    subtract(num) {
        throw "Could not modify constants.";
    }

}

class InputStream {

    constructor(input) {
        this.reset();
    }

    get value() {
        const nextValue = this._iterator.next();

        return (nextValue.done) ? 0 : nextValue.value.codePointAt(0);
    }

    get io() {
        return true;
    }

    reset(input) {
        if (!input) {
            input = '';
        }

        this._iterator = input[Symbol.iterator]();
    }

    set(value) {
        throw "Could not set value for InputStream.";
    }

    add(num) {
        throw "Could add to InputStream.";
    }

    subtract(num) {
        throw "Could not subtract to InputStream.";
    }

}

class OutputStream {

    constructor() {
        this._output = '';
    }

    get value() {
        throw "Could not read from Output";
    }

    get output() {
        return this._output;
    }

    get io() {
        return true;
    }

    reset() {
        this._output = '';
    }

    set(value) {
        if (this._output.length >= MAX_OUTPUT_LEN) {
            throw "Maximum output size exceeded."
        }

        const newChar = String.fromCodePoint(value);
        this._output = this._output.concat(newChar);
    }

    add(num) {
        throw "Could not add to Output";
    }

    subtract(num) {
        throw "Could not subtract to Output";
    }

}

class AbstractCommand {

    constructor(args, variables) {
        if ((!variables.has(args[0])) || (!variables.has(args[1]))) {
            throw "Unknown variable passed as command argument.";
        }

        this._varA = variables.get(args[0]);
        this._varB = variables.get(args[1]);

        if ((this._varA.io || this._varB.io) && (!this.supportIo)) {
            throw "The commands does not support Input/Output variables.";
        }
    }

}

class SetCommand extends AbstractCommand {

    constructor(args, variables) {
        super(args, variables);
    }

    get supportIo() {
        return true;
    }

    execute() {
        if (this._varA.io && this._varB.io) {
            throw "Could not use two Input/Output variables as arguments to a command.";
        }
        this._varA.set(this._varB.value);
    }

}

class AddCommand extends AbstractCommand {

    constructor(args, variables) {
        super(args, variables);
    }

    get supportIo() {
        return false;
    }

    execute() {
        this._varA.add(this._varB.value);
    }

}

class SubtractCommand extends AbstractCommand {

    constructor(args, variables) {
        super(args, variables);
    }

    get supportIo() {
        return false;
    }

    execute() {
        this._varA.subtract(this._varB.value);
    }

}

class IfCommand extends AbstractCommand {

    constructor(args, variables) {
        super(args, variables);
        this._instructionCounter = variables.get(INSTRUCTION_COUNTER);
    }

    get supportIo() {
        return false;
    }

    execute() {
        if (this._varA.value == this._varB.value) {
            this._instructionCounter.add(1); // Skip the next line
        }
    }

}

class NoOpCommand {

    execute() {
    }

}

const COMMANDS = {
    [SET_COMMAND]: SetCommand,
    [ADD_COMMAND]: AddCommand,
    [SUBTRACT_COMMAND]: SubtractCommand,
    [IF_COMMAND]: IfCommand,
    [NO_OP_COMMAND]: NoOpCommand
};

module.exports = class Program {

    constructor(sourceCode) {
        this._variables = new Map();

        this._variables.set(INSTRUCTION_COUNTER, new Variable());
        this._variables.set(INPUT_STREAM, new InputStream(''));
        this._variables.set(OUTPUT_STREAM, new OutputStream());

        this._variables.set(CONST_0, new Constant(0));
        this._variables.set(CONST_1, new Constant(1));
        this._variables.set(CONST_2, new Constant(2));
        this._variables.set(CONST_4, new Constant(4));
        this._variables.set(CONST_8, new Constant(8));

        this._variables.set(VAR_1, new Variable());
        this._variables.set(VAR_2, new Variable());
        this._variables.set(VAR_3, new Variable());
        this._variables.set(VAR_4, new Variable());
        this._variables.set(VAR_5, new Variable());
        this._variables.set(VAR_6, new Variable());
        this._variables.set(VAR_7, new Variable());
        this._variables.set(VAR_8, new Variable());
        this._variables.set(VAR_9, new Variable());
        this._variables.set(VAR_10, new Variable());
        this._variables.set(VAR_11, new Variable());
        this._variables.set(VAR_12, new Variable());

        this._variables.set(VAR_13, new Variable());
        this._variables.set(VAR_14, new Variable());
        this._variables.set(VAR_15, new Variable());
        this._variables.set(VAR_16, new Variable());
        this._variables.set(VAR_17, new Variable());
        this._variables.set(VAR_18, new Variable());
        this._variables.set(VAR_19, new Variable());
        this._variables.set(VAR_20, new Variable());
        this._variables.set(VAR_21, new Variable());
        this._variables.set(VAR_22, new Variable());
        this._variables.set(VAR_23, new Variable());
        this._variables.set(VAR_24, new Variable());

        this._instructions = [];

        this._parse(sourceCode);
    }

    get commandsCount() {
        return this._commandsCount;
    }

    run(input) {
        this._reset();
        if (input) {
            this._variables.get(INPUT_STREAM).reset(input);
        }

        const startTime = new Date().getTime();
        const instructionCounter = this._variables.get(INSTRUCTION_COUNTER);
        while(instructionCounter.value < this._instructions.length) {
            instructionCounter.add(1);
            const instruction = this._instructions[instructionCounter.value - 1];

            instruction.execute();

            const currentTime = new Date().getTime();
            if (currentTime - startTime > MAX_EXECUTION_TIME) {
                throw "Maximum allowed execution time exceeded.";
            }
        }

        return this._variables.get(OUTPUT_STREAM).output;
    }

    _parse(sourceCode) {
        const lines = sourceCode.split(/\r\n|\r|\n/g, MAX_COMMANDS + 1);
        if (lines.length > MAX_COMMANDS) {
            throw "Instructions limit exceeded.";
        }

        this._commandsCount = 0;
        for (const line of lines) {
            const instruction = this._parseLine(line);
            this._instructions.push(instruction);
        }
    }

    _parseLine(line) {
        const chars = Array.from(line);
        if (chars.length == 0) {
            return new COMMANDS[NO_OP_COMMAND]();
        }

        const commandChar = chars[0];
        const commandArgs = chars.slice(1);
        if (!(commandChar in COMMANDS) || commandArgs.length < 2) {
            return new COMMANDS[NO_OP_COMMAND]();
        }
        this._commandsCount++;

        return new COMMANDS[commandChar](commandArgs, this._variables);
    }

    _reset() {
        for (const variable of this._variables.values()) {
            variable.reset();
        }
    }

}

