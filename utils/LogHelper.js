const path = require('path');
const fs = require('fs-extra');

const LogFolderName = "/changeLogs";

function initUserLogFiles(usersMongoIds) {
    // folder one level above the project
    const __parentDir = path.join(process.cwd(), '../');
    const logFolder = __parentDir + LogFolderName;

    return fs.ensureDir(logFolder)
        .then(() => {
            // if folder already exist, empty it.
            return fs.emptyDir(logFolder);
        })
        .then(() => {
            const initUserLogObj = {"updates": []};
             // @link:https://itnext.io/https-medium-com-popov4ik4-what-about-promises-in-loops-e94c97ad39c0
            const userLogPromises = usersMongoIds.map(userId => {
                const fileName = logFolder + "/user-" + userId + ".json";
                return fs.writeJson(fileName, initUserLogObj, {flag: 'w'});
            });
            return Promise.all(userLogPromises);
        })
        .then( ( ) => {
            console.log("Success: User Log Files were initialized.");
        })
        .catch(err => {
            console.error(err);
            exit(1);
        })
}

async function logPostAction(createdItem) {

}

async function logPutAction( oldItem, updatedItem ) {

}

async function logPatchAction( oldItem, updatedItem ) {

}

async function logDeleteAction( deletedItem ) {

}

module.exports = { initUserLogFiles, logPostAction, logPutAction, logPatchAction, logDeleteAction };
