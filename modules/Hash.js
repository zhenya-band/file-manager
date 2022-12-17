import FileSystem from './FileSystem.js';
import path, { resolve, join } from 'path'
import { readFile } from 'fs/promises';
import { createHash } from 'crypto';

class Hash {

    constructor() { }

    async calculate(pathToFile) {
        try {
            const isAbsolutePath = path.isAbsolute(pathToFile);
            const resolvedPath = isAbsolutePath ? resolve(pathToFile) : resolve(join(FileSystem.currentDirectory, pathToFile));

            const content = await readFile(resolvedPath, { encoding: 'utf8' })
            const hash = createHash('sha256').update(content).digest('hex');

            console.log(hash);
        } catch (error) {
            console.error(error);
        }
    }

}

export default new Hash();