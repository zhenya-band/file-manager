import FileSystem from "../modules/FileSystem.js";
import Logger from "../modules/Logger.js";

export const init = () => {
    Logger.printHello();
    FileSystem.goToHomeDir();
    Logger.printCurrentDirectory();
}