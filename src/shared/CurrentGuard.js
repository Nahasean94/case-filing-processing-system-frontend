class CurrentGuard {
    state= {
        guard_id:''
    }

    setGuardId(id) {
        this.state.guard_id=id
    }

    getGuardId() {
        return this.state.guard_id
    }

}


const instance = new CurrentGuard()
Object.freeze(instance)

export default instance
