import { COMMANDS } from './constants/commands.js';
import { getArguments } from './helpers/getArguments.js';
import { init } from './helpers/init.js';
import FileSystem from './modules/FileSystem.js';
import Hash from './modules/Hash.js';
import Logger from './modules/Logger.js';
import Os from './modules/Os.js';
import Zlib from './modules/Zlib.js';

init();

process.stdin.on('data', async (data) => {
    const [command, arg1, arg2] = getArguments(data);

    if (!COMMANDS.includes(command)) {
        Logger.printInvalidInput();
    }

    if (command === ".exit") {
        process.exit();
    }

    if (command === "ls") {
        const files = await FileSystem.ls();
        Logger.logTable(files);
    }

    if (command === "cd") {
        await FileSystem.cd(arg1);
    }

    if (command === "up") {
        await FileSystem.up();
    }

    if (command === "cat") {
        await FileSystem.cat(arg1);
    }

    if (command === "add") {
        await FileSystem.add(arg1);
    }

    if (command === "rn") {
        await FileSystem.rn(arg1, arg2);
    }

    if (command === "rm") {
        await FileSystem.rm(arg1);
    }

    if (command === "cp") {
        await FileSystem.cp(arg1, arg2);
    }

    if (command === "mv") {
        await FileSystem.mv(arg1, arg2);
    }

    if (command === "os") {
        Os.getInfo(arg1);
    }

    if (command === "hash") {
        Hash.calculate(arg1);
    }

    if (command === "compress") {
        Zlib.compress(arg1, arg2);
    }

    if (command === "decompress") {
        Zlib.decompress(arg1, arg2)
    }

    Logger.printCurrentDirectory()
})

process
    .on("SIGINT", () => {
        process.exit();
    })
    .on("exit", () => {
        Logger.printGoodbye()
    });