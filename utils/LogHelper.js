/**
 * LogHelper is used to manage log files log changes
 * for user and its related items.
 *
 */

const path = require('path');
const os = require('os');
const fs = require('fs-extra');

function getLogFolder() {
    // folder one level above the project
    const LogFolderName = "/changeLogs";
    const __parentDir = path.join(process.cwd(), '../');
    const logFolder = __parentDir + LogFolderName;
    return logFolder;
}

function getUserChangesLogFileName(userId) {
    const logFolder = getLogFolder();
    let fileName = `${logFolder}/user-${userId}.json`;
    return fileName;
}

function initUserLogFiles(usersMongoIds) {
    const logFolder = getLogFolder();

    return fs.ensureDir(logFolder)
        .then(() => {
            // if folder already exist, empty it.
            return fs.emptyDir(logFolder);
        })
        .then(() => {
            const initUserLogObj = {"updates": []};
             // @link:https://itnext.io/https-medium-com-popov4ik4-what-about-promises-in-loops-e94c97ad39c0
            const userLogPromises = usersMongoIds.map(userId => {
                let fileName = getUserChangesLogFileName(userId);
                return fs.writeJson(fileName, initUserLogObj, {flag: 'w', EOL: os.EOL, spaces:"\t"});
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

/**
 * @link:https://github.com/nodejs/help/issues/249#issuecomment-239352740
 * @returns {string}
 */
function getLogUpdateDate() {
    return new Date(Date.now()).toLocaleString();
}

/**
 * To write to the log ss specified in API definition,
 * or delete log file on DELETE user.
 * @param ItemHelper
 * @param originalItem
 * @param newItem
 * @param needToLog
 * @returns {Promise<* | *>}
 */
async function logChange(ItemHelper, originalItem, newItem, needToLog = true ) {
    let curItem = originalItem ? originalItem : newItem;
    let userId = ItemHelper.getUserId( curItem );

    // no need to log, delete log file
    if( needToLog === false ) {
        return deleteLogFile(userId);
    }

    let logFileName = getUserChangesLogFileName( userId );
    let curDate = getLogUpdateDate();
    let newLogItem = {
        "Date" : curDate,
        "OriginalData": ( originalItem ? originalItem.toObject() : null ),
        "NewData": ( newItem ? newItem.toObject() : null )
        };

    return fs.readJson(logFileName,{flag: 'r'})
        .then( curLog => {
            // let curUpdatesArr = curLog.updates;
            curLog.updates.push(newLogItem);
            return fs.writeJson(logFileName,curLog,{flag: 'w',EOL: os.EOL, spaces:"\t"});
        } )
        .catch(err => {
            console.error(err)
        })
}

function deleteLogFile(userId) {
    let logFileName = getUserChangesLogFileName( userId );
    return fs.remove(logFileName)
        .catch(err => {
            console.error(err)
        })

}

module.exports = { initUserLogFiles, logChange };
