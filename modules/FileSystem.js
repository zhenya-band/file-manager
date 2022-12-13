import path, { resolve } from 'path';
import os from 'os';
import { readdir } from 'fs/promises';
import Helpers from './Helpers.js';

class FileSystem {

    constructor() {
        this.homeDir = os.homedir();
        this.currentDirectory = os.homedir();
    }

    getHomeDirectory() {
        return this.homeDir;
    }

    getCurrentDirectory() {
        return this.currentDirectory;
    }

    goToHomeDir() {
        this.currentDirectory = path.resolve(this.homeDir)
    }

    cathError(error) {
        // !TODO remove console
        console.error(error);
        console.log(`Operation failed`);
    }

    getFileType(file) {
        if (file.isFile()) return "file";
        if (file.isDirectory()) return "directory";
        return 'unknown';
    }

    async ls() {
        try {
            const currentPath = this.getCurrentDirectory();
            const readDirRes = await readdir(currentPath, { withFileTypes: true });
            const result = [];

            for (const file of readDirRes) {
                const type = this.getFileType(file);
                result.push({ name: file.name, type });
            }

            return Helpers.sortFiles(result);

        } catch (error) {
            this.cathError(error);
        }
    }

    async cd(pathToDir) {
        try {
            const isAbsolutePath = path.isAbsolute(pathToDir);
            const resolvedPath = isAbsolutePath ? resolve(pathToDir) : resolve(path.join(this.currentDirectory, pathToDir));

            await Helpers.isDirectoryExist(resolvedPath);

            this.currentDirectory = resolvedPath;

        } catch (error) {
            this.cathError(error)
        }
    }
}

export default new FileSystem();