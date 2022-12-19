import { readFile } from 'fs/promises';
import { createHash } from 'crypto';
import { resolvePath } from '../helpers/resolvePath.js';
import FileSystemHelpers from './FileSystemHelpers.js';
import { throwInvalidInput, throwOperationFailedError } from '../helpers/Errors.js';

class Hash {

    constructor() { }

    async calculate(pathToFile) {
        try {
            if (!pathToFile) throwInvalidInput();

            const resolvedPath = resolvePath(pathToFile);
            const isFileExist = await FileSystemHelpers.isFileExist(resolvedPath);

            if (!isFileExist) throwOperationFailedError();

            const content = await readFile(resolvedPath, { encoding: 'utf8' })
            const hash = createHash('sha256').update(content).digest('hex');

            console.log(hash);
        } catch (error) {
            console.error(error);
        }
    }

}

export default new Hash();