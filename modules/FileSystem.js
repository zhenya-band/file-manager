import path from 'path';
import os from 'os';
import { readdir, open, rename, unlink } from 'fs/promises';
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import Helpers from './FileSystemHelpers.js';
import { resolvePath } from '../helpers/resolvePath.js';
import { throwInvalidInput, throwOperationFailedError } from '../helpers/Errors.js';

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
        console.log(error.message);
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
            if (!pathToDir) throwInvalidInput();

            const resolvedPath = resolvePath(pathToDir);

            const isExist = await Helpers.isDirectoryExist(resolvedPath);
            if (!isExist) throwOperationFailedError();

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
            if (!pathToFile) throwInvalidInput();

            const resolvedPath = resolvePath(pathToFile);

            const isExist = await Helpers.isFileExist(resolvedPath);
            if (!isExist) throwOperationFailedError();

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
            if (!fileName) throwInvalidInput();

            const pathToFile = path.join(this.currentDirectory, fileName);
            const isExist = await Helpers.isFileExist(pathToFile);

            if (isExist) throwOperationFailedError();

            const file = await open(pathToFile, "a");
            await file.close();

        } catch (error) {
            this.cathError(error)
        }
    }

    async rn(pathToFile, newFilename) {
        try {
            if (!pathToFile || !newFilename) throwInvalidInput();

            const oldPath = resolvePath(pathToFile);
            const isExist = await Helpers.isFileExist(oldPath);
            if (!isExist) throwOperationFailedError();

            const newPath = path.join(path.dirname(oldPath), newFilename);
            await rename(oldPath, newPath);
        } catch (error) {
            this.cathError(error)
        }
    }

    async cp(pathToFile, pathToNewDirectory) {
        try {
            if (!pathToFile || !pathToNewDirectory) throwInvalidInput();

            const resolvedPathToFile = resolvePath(pathToFile);
            const resolvedPathToNewDirectory = resolvePath(pathToNewDirectory);

            const isExistFileExist = await Helpers.isFileExist(resolvedPathToFile);
            const isDirFileExist = await Helpers.isDirectoryExist(resolvedPathToNewDirectory);

            if (!isExistFileExist || !isDirFileExist) throwOperationFailedError();

            const readStream = await createReadStream(resolvedPathToFile);
            const writeStream = await createWriteStream(path.join(resolvedPathToNewDirectory, path.basename(resolvedPathToFile)));
            await pipeline(readStream, writeStream);
        } catch (error) {
            this.cathError(error)
        }
    }

    async mv(pathToFile, pathToNewDirectory) {
        try {
            if (!pathToFile || !pathToNewDirectory) throwInvalidInput();

            await this.cp(pathToFile, pathToNewDirectory);

            const resolvedPathToFile = resolvePath(pathToFile);
            await unlink(resolvedPathToFile);

        } catch (error) {
            this.cathError(error)
        }
    }

    async rm(pathToFile) {
        try {
            if (!pathToFile) throwInvalidInput();

            const resolvedPath = resolvePath(pathToFile);
            const isExist = await Helpers.isFileExist(resolvedPath);
            if (!isExist) throwOperationFailedError();

            await unlink(resolvedPath);

        } catch (error) {
            this.cathError(error)
        }
    }

}

export default new FileSystem();