import FileSystem from './modules/FileSystem.js';
import Hash from './modules/Hash.js';
import Logger from './modules/Logger.js';
import Os from './modules/Os.js';
import Zlib from './modules/Zlib.js';

Logger.printHello();
FileSystem.goToHomeDir();
Logger.printCurrentDirectory();

process.stdin.on('data', async (data) => {
    const args = data.toString().split(' ');
    const command = args[0].trim();

    if (command === ".exit") {
        process.exit();
    }

    if (command === "ls") {
        const files = await FileSystem.ls();
        Logger.logTable(files);
        Logger.printCurrentDirectory()
    }

    if (command === "cd") {
        const path = args[1].trim();

        await FileSystem.cd(path);
        Logger.printCurrentDirectory()
    }

    if (command === "up") {
        await FileSystem.up();
        Logger.printCurrentDirectory()
    }

    if (command === "cat") {
        const path = args[1].trim();

        await FileSystem.cat(path);
        Logger.printCurrentDirectory()
    }

    if (command === "add") {
        const newFileName = args[1].trim();

        await FileSystem.add(newFileName);
        Logger.printCurrentDirectory()
    }

    if (command === "rn") {
        const pathToFile = args[1].trim();
        const newFilename = args[2].trim();

        await FileSystem.rn(pathToFile, newFilename);
        Logger.printCurrentDirectory()
    }

    if (command === "rm") {
        const pathToFile = args[1].trim();

        await FileSystem.rm(pathToFile);
        Logger.printCurrentDirectory()
    }

    if (command === "cp") {
        const pathToFile = args[1].trim();
        const pathToNewDirectory = args[2].trim();

        await FileSystem.cp(pathToFile, pathToNewDirectory);
        Logger.printCurrentDirectory()
    }

    if (command === "mv") {
        const pathToFile = args[1].trim();
        const pathToNewDirectory = args[2].trim();

        await FileSystem.mv(pathToFile, pathToNewDirectory);
        Logger.printCurrentDirectory()
    }

    if (command === "rm") {
        const pathToFile = args[1].trim();

        await FileSystem.rm(pathToFile);
        Logger.printCurrentDirectory()
    }

    if (command === "os") {
        const arg = args[1].trim();

        Os.getInfo(arg);
        Logger.printCurrentDirectory()
    }

    if (command === "hash") {
        const arg = args[1].trim();

        Hash.calculate(arg);
        Logger.printCurrentDirectory()
    }

    if (command === "compress") {
        const arg1 = args[1].trim();
        const arg2 = args[2].trim();

        Zlib.compress(arg1, arg2)
        Logger.printCurrentDirectory()
    }

    if (command === "decompress") {
        const arg1 = args[1].trim();
        const arg2 = args[2].trim();

        Zlib.decompress(arg1, arg2)
        Logger.printCurrentDirectory()
    }

})

process
    .on("SIGINT", () => {
        process.exit();
    })
    .on("exit", () => {
        Logger.printGoodbye()
    });