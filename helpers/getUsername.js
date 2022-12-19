export const getUsername = () => {
    const args = process.argv;
    const userNameArg = args.find((arg) => arg.startsWith('--username'));
    if (!userNameArg) return 'Anonymous user';

    const userName = userNameArg.split('=')[1];

    return userName;
}