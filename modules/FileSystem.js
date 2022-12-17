import path, { resolve } from 'path';
import os from 'os';
import { readdir, open, rename, rm } from 'fs/promises';
import { createReadStream } from 'node:fs';
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

    async up() {
        try {
            await this.cd('..');
        } catch (error) {
            this.cathError(error)
        }
    }

    async cat(pathToFile) {
        try {
            const isAbsolutePath = path.isAbsolute(pathToFile);
            const resolvedPath = isAbsolutePath ? resolve(pathToFile) : resolve(path.join(this.currentDirectory, pathToFile));
            await Helpers.isFileExist(resolvedPath);

            const readStream = await createReadStream(resolvedPath);

            return new Promise((resolve, reject) => {
                readStream.on('data', (data) => {
                    console.log(data.toString());
                });
                readStream.on("end", resolve);
                readStream.on("error", reject);
            })

        } catch (error) {
            this.cathError(error)
        }
    }

    async add(fileName) {
        try {
            const pathToFile = path.join(this.currentDirectory, fileName);
            const isExist = await Helpers.isFileExist(pathToFile);

            if (isExist) {
                throw Error('File already exist');
            }

            const file = await open(pathToFile, "a");
            await file.close();

        } catch (error) {
            this.cathError(error)
        }
    }

    async rn(pathToFile, newFilename) {
        try {
            const isAbsolutePath = path.isAbsolute(pathToFile);
            const oldPath = isAbsolutePath ? resolve(pathToFile) : resolve(path.join(this.currentDirectory, pathToFile));
            const isExist = await Helpers.isFileExist(oldPath);
            if (!isExist) throw Error('File not exist');

            const newPath = path.join(path.dirname(oldPath), newFilename);
            await rename(oldPath, newPath);
        } catch (error) {
            this.cathError(error)
        }
    }

    async rm(pathToFile) {
        try {
            const isAbsolutePath = path.isAbsolute(pathToFile);
            const resolvedPath = isAbsolutePath ? resolve(pathToFile) : resolve(path.join(this.currentDirectory, pathToFile));
            const isExist = await Helpers.isFileExist(resolvedPath);
            if (!isExist) throw Error('File not exist');

            await rm(resolvedPath);
        } catch (error) {
            this.cathError(error)
        }
    }
}

export default new FileSystem();