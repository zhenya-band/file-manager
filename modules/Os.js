import os from 'os';
import FileSystem from './FileSystem.js';
import { getUsername } from '../helpers/getUsername.js';

class Os {

    constructor() { }

    getEol() {
        return JSON.stringify(os.EOL);
    }

    getCpusInfo() {
        const cpus = os.cpus();
        const cpusInfo = cpus.map((cpu) => ({ model: cpu.model, 'clock rate': `${cpu.speed / 1000} GHz` }))

        return {
            total: cpus.length,
            cpusInfo,
        }

    }

    getHomedir() {
        return FileSystem.getHomeDirectory();
    }

    getUsername() {
        return getUsername();
    }

    getArchitecture() {
        return os.arch();
    }

    getInfo(key) {
        switch (key) {
            case "--EOL":
                const eol = this.getEol();
                console.log(`eol: ${eol}`);
                break;
            case "--cpus":
                const { total, cpusInfo } = this.getCpusInfo();
                console.log("Total cpus:", total);
                console.table(cpusInfo);
                break;
            case "--homedir":
                console.log(`Home dir: ${this.getHomedir()}`);
                break;
            case "--username":
                console.log(`Username: ${this.getUsername()}`);
                break;
            case "--architecture":
                console.log(`architecture: ${this.getArchitecture()}`);
                break;
            default:
                console.log("Invalid input");
        }
    }

}

export default new Os();