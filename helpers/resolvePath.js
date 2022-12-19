import path from 'path';

import FileSystem from '../modules/FileSystem.js';

export const resolvePath = (inputPath) => {
    const isAbsolutePath = path.isAbsolute(inputPath);
    const resolvedPath = isAbsolutePath ? path.resolve(inputPath) : path.resolve(FileSystem.currentDirectory, inputPath);

    return resolvedPath;
}