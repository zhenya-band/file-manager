import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createBrotliDecompress } from 'node:zlib';
import { createBrotliCompress } from 'zlib';
import { resolvePath } from '../helpers/resolvePath.js';
import { throwInvalidInput, throwOperationFailedError } from '../helpers/Errors.js';
import FileSystemHelpers from './FileSystemHelpers.js';

class Zlib {

    constructor() { }

    async compress(pathToSrc, pathToDest) {
        try {
            if (!pathToSrc || !pathToDest) throwInvalidInput();

            const resolvedPathToSrc = resolvePath(pathToSrc);
            const resolvedPathToDest = resolvePath(pathToDest);

            const isSrcExist = await FileSystemHelpers.isFileExist(resolvedPathToSrc);
            const isDestExist = await FileSystemHelpers.isDirectoryExist(resolvedPathToDest);

            if (!isSrcExist || !isDestExist) throwOperationFailedError();

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
            const resolvedPathToSrc = resolvePath(pathToFile);
            const resolvedPathToDest = resolvePath(pathToDest);
            const isDestDirectoryExist = await FileSystemHelpers.isDirectoryExist(resolvedPathToDest)

            if (path.parse(resolvedPathToSrc).ext !== ".br") throwOperationFailedError();
            if (!isDestDirectoryExist) throwOperationFailedError();


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