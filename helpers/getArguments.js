export const getArguments = (str) => {
    const regex = /("[^"]+"|[^\s"]+)/gi
    const args = str.toString().trim().match(regex);

    const [command, arg1, arg2] = args;

    return [command, arg1, arg2];
}