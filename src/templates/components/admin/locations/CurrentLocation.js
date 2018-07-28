class CurrentLocation {
    state= {
        location:''
    }

    setLocation(location) {
        this.state.location=location
    }

    getLocation() {
        return this.state.location
    }

}


const instance = new CurrentLocation()
Object.freeze(instance)

export default instance
