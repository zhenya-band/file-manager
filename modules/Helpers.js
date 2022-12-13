import { access } from 'fs/promises';
import fs from 'fs';

class Helpers {

    constructor() {}

    alphabeticallySortFiles = (a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }

    sortFiles(inputFiles) {
        const directories = inputFiles.filter((file) => file.type === 'directory').sort(this.alphabeticallySortFiles);
        const files = inputFiles.filter((file) => file.type === 'file').sort(this.alphabeticallySortFiles);
        const others = inputFiles.filter((file) => file.type !== 'file' && file.type !== 'directory').sort(this.alphabeticallySortFiles);

        return [...directories, ...files, ...others];
    }

    async isDirectoryExist(path) {
        try {
            await access(path, fs.constants.F_OK);
            return true;
        } catch (error) {
            throw Error(error);
        }
    }
}

export default new Helpers();