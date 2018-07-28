import React from 'react'
import {Nav, NavItem, NavLink} from "reactstrap"


export default ({router, active}) => {
    const onGuardsLink = (e) => {
        e.preventDefault()
        router.history.push("/admin/guards")
    }
    const onLocationsLink = (e) => {
        e.preventDefault()
        router.history.push("/admin/locations")
    }
    const onCourtStationsLink = (e) => {
        e.preventDefault()
        router.history.push("/admin/dashboard/court-stations")
    }
    const onAttendanceLink = (e) => {
        e.preventDefault()
        router.history.push("/admin/attendance")
    }

    return <Nav pills vertical  className="bd-links" id="bd-docs-nav">
        <NavItem>
            <NavLink href="" onClick={onCourtStationsLink} active={active === 'court-station'}>Court Stations</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="" onClick={onGuardsLink} active={active === 'guards'}>Case Forms</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="" onClick={onLocationsLink} active={active === 'locations'}>Case categories</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="" onClick={onLocationsLink} active={active === 'locations'}>Advocates</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="" onClick={onAttendanceLink} active={active === 'attendance'}>Court assistants</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="" onClick={onAttendanceLink} active={active === 'attendance'}>Deputy registrars</NavLink>
        </NavItem>

    </Nav>


}
