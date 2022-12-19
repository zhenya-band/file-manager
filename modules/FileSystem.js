import path, { resolve } from 'path';
import os from 'os';
import { readdir, open, rename, rm, unlink } from 'fs/promises';
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import Helpers from './Helpers.js';
import { resolvePath } from '../helpers/resolvePath.js';

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
            const resolvedPath = resolvePath(pathToDir);

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

    async cp(pathToFile, pathToNewDirectory) {
        try {
            const isAbsolutePathToFile = path.isAbsolute(pathToFile);
            const resolvedPathToFile = isAbsolutePathToFile ? resolve(pathToFile) : resolve(path.join(this.currentDirectory, pathToFile));

            const isAbsolutePathToDir = path.isAbsolute(pathToNewDirectory);
            const resolvedPathToNewDirectory = isAbsolutePathToDir ? resolve(pathToNewDirectory) : resolve(path.join(this.currentDirectory, pathToNewDirectory));

            const isExistFileExist = await Helpers.isFileExist(resolvedPathToFile);
            const isDirFileExist = await Helpers.isDirectoryExist(resolvedPathToNewDirectory);

            if (!isExistFileExist || !isDirFileExist) throw Error('File not exist');

            const readStream = await createReadStream(resolvedPathToFile);
            const writeStream = await createWriteStream(path.join(resolvedPathToNewDirectory, path.basename(resolvedPathToFile)));
            await pipeline(readStream, writeStream);

        } catch (error) {
            this.cathError(error)
        }
    }

    async mv(pathToFile, pathToNewDirectory) {
        try {
            await this.cp(pathToFile, pathToNewDirectory);

            const isAbsolutePathToFile = path.isAbsolute(pathToFile);
            const resolvedPathToFile = isAbsolutePathToFile ? resolve(pathToFile) : resolve(path.join(this.currentDirectory, pathToFile));
            await unlink(resolvedPathToFile);

        } catch (error) {
            this.cathError(error)
        }
    }

    async rm(pathToFile) {
        try {
            const isAbsolutePathToFile = path.isAbsolute(pathToFile);
            const resolvedPathToFile = isAbsolutePathToFile ? resolve(pathToFile) : resolve(path.join(this.currentDirectory, pathToFile));
            await unlink(resolvedPathToFile);

        } catch (error) {
            this.cathError(error)
        }
    }

}

export default new FileSystem();