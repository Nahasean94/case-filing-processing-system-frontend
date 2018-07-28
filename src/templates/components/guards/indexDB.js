import idb from "idb"


export const dbPromise = idb.open('security-manager', 1, function (upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains('guards')) {
        const securityGuard = upgradeDb.createObjectStore('guards', {keyPath: 'guard_id'})
        securityGuard.createIndex('guard_id', 'guard_id', {unique: true})
    }
    if (!upgradeDb.objectStoreNames.contains('attendance')) {
        const securityGuard = upgradeDb.createObjectStore('attendance', {keyPath: 'date'})
        securityGuard.createIndex('date', 'date', {unique: true})
        securityGuard.createIndex('guard_id', 'guard_id', {unique: false})
    }
})