"use strict"
import React from 'react'
import {Nav, NavItem, NavLink} from "reactstrap"


export default ({router, active}) => {
    const onPendingCasesLink = (e) => {
        e.preventDefault()
        router.history.push("/advocates/dashboard/pending-cases")
    }
    const onCompleteCasesLink = (e) => {
        e.preventDefault()
        router.history.push("/advocates/dashboard/completed-cases")
    }
    const onNewCaseLink = (e) => {
        e.preventDefault()
        router.history.push("/advocates/dashboard/new-case")
    }
    const onServedCasesLink = (e) => {
        e.preventDefault()
        router.history.push("/advocates/dashboard/served-cases")
    }
    const onProfileLink = (e) => {
        e.preventDefault()
        router.history.push("/advocates/dashboard/profile")
    }
    const onClientsLink = (e) => {
        e.preventDefault()
        router.history.push("/advocates/dashboard/clientele")
    }

    return <Nav pills vertical  className="bd-links" id="bd-docs-nav">
        <NavItem>
            <NavLink href="" onClick={onNewCaseLink} active={active === 'new-case'}>New case</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="" onClick={onServedCasesLink} active={active === 'served-cases'}>Served cases</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="" onClick={onPendingCasesLink} active={active === 'pending-cases'}>Pending cases</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="" onClick={onCompleteCasesLink} active={active === 'completed-cases'}>Complete cases</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="" onClick={onClientsLink} active={active === 'clientele'}>Clients</NavLink>
        </NavItem>
        {/*<NavItem>*/}
            {/*<NavLink href="" onClick={onProfileLink} active={active === 'profile'}>Profile</NavLink>*/}
        {/*</NavItem>*/}

    </Nav>


}
