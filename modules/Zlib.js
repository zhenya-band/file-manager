import { createReadStream, createWriteStream } from 'node:fs';
import path, { join, resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createBrotliDecompress } from 'node:zlib';
import { createBrotliCompress } from 'zlib';
import FileSystem from './FileSystem.js';

class Zlib {

    constructor() { }

    async compress(pathToSrc, pathToDest) {
        try {

            const isAbsolutePathSrc = path.isAbsolute(pathToSrc);
            const resolvedPathToSrc = isAbsolutePathSrc ? resolve(pathToSrc) : resolve(FileSystem.currentDirectory, pathToSrc);

            const isAbsolutePathDest = path.isAbsolute(pathToDest);
            const resolvedPathToDest = isAbsolutePathDest ? resolve(pathToDest) : resolve(FileSystem.currentDirectory, pathToDest, path.basename(resolvedPathToSrc) + '.br');

            console.log("resolvedPathToSrc", resolvedPathToSrc);
            console.log("resolvedPathToDest", resolvedPathToDest);

            await pipeline(
                createReadStream(resolvedPathToSrc),
                createBrotliCompress(),
                createWriteStream(resolvedPathToDest)
            );

        } catch (error) {
            console.error(error);
        }
    }

    async decompress(pathToFile, pathToDest) {
        try {
            const isAbsolutePathSrc = path.isAbsolute(pathToFile);
            const resolvedPathToSrc = isAbsolutePathSrc ? resolve(pathToFile) : resolve(FileSystem.currentDirectory, pathToFile);
            if (path.parse(resolvedPathToSrc).ext !== ".br") throw new Error("File is not a .br");

            const isAbsolutePathDest = path.isAbsolute(pathToDest);
            const resolvedPathToDest = isAbsolutePathDest ? resolve(pathToDest) : resolve(FileSystem.currentDirectory, pathToDest, path.parse(resolvedPathToSrc).name);

            await pipeline(
                createReadStream(resolvedPathToSrc),
                createBrotliDecompress(),
                createWriteStream(resolvedPathToDest)
            );

        } catch (error) {
            console.error(error);
        }
    }

}

export default new Zlib();