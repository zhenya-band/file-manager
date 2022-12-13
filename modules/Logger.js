import { getUsername } from './args.js';
import FileSystem from './FileSystem.js'

class Logger {

    constructor() {
        this.userName = getUsername();
    }

    printHello = () => {
        console.log(`Welcome to the File Manager, ${this.userName}!`)
    }

    printGoodbye = () => {
        console.log(`Thank you for using File Manager, ${this.userName}, goodbye!`)
    }

    printCurrentDirectory() {
        const currentDir = FileSystem.getCurrentDirectory();
        console.log(`You are currently in ${currentDir}`);
    }

    logTable(data) {
        console.table(data);
    }
}

export default new Logger();