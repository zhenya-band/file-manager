export const getArguments = (str) => {
    const formatedData = str.toString().trim();

    if (!formatedData) return [];

    const regex = /("[^"]+"|[^\s"]+)/gi
    const args = str.toString().trim().match(regex)?.map((arg) => arg.replaceAll('"', ""));

    const [command, arg1, arg2] = args;

    return [command, arg1, arg2];
}