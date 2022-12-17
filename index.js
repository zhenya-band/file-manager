import FileSystem from './modules/FileSystem.js';
import Logger from './modules/Logger.js';

Logger.printHello();
FileSystem.goToHomeDir();
Logger.printCurrentDirectory();

process.stdin.on('data', async (data) => {
    const args = data.toString().split(' ');
    const command = args[0].trim();

    if (command === ".exit") {
        Logger.printGoodbye()
        process.exit(0);
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

})

process.on("SIGINT", () => {
    Logger.printGoodbye()
})