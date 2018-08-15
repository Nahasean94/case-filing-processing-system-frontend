"use strict"
import React from 'react'
import {Nav, NavItem, NavLink} from "reactstrap"


export default ({router, active}) => {
    const onPendingCasesLink = (e) => {
        e.preventDefault()
        router.history.push("/deputy-registrar/dashboard/pending-cases")
    }
    const onCompleteCasesLink = (e) => {
        e.preventDefault()
        router.history.push("/deputy-registrar/dashboard/completed-cases")
    }
    const onServedCasesLink = (e) => {
        e.preventDefault()
        router.history.push("/deputy-registrar/dashboard/served-cases")
    }


    return <Nav pills vertical  className="bd-links" id="bd-docs-nav">
        <NavItem>
            <NavLink href="" onClick={onPendingCasesLink} active={active === 'pending-cases'}>Pending cases</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="" onClick={onServedCasesLink} active={active === 'served-cases'}>Served cases</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="" onClick={onCompleteCasesLink} active={active === 'completed-cases'}>Complete cases</NavLink>
        </NavItem>
    </Nav>


}
