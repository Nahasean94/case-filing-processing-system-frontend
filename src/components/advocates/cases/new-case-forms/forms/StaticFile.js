"use strict"
class StaticFile {
    state= {
        file:''
    }

    setFile(file) {
        this.state.file=file
    }

    getFile() {
        return this.state.file
    }

}


const instance = new StaticFile()
Object.freeze(instance)

export default instance
