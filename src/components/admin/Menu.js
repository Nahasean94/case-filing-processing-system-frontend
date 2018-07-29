import React from 'react'
import {Nav, NavItem, NavLink} from "reactstrap"


export default ({router, active}) => {
    const onCaseFormsLink = (e) => {
        e.preventDefault()
        router.history.push("/admin/dashboard/case-forms")
    }
    const onCaseCategoriesLink = (e) => {
        e.preventDefault()
        router.history.push("/admin/dashboard/case-categories")
    }
    const onCourtStationsLink = (e) => {
        e.preventDefault()
        router.history.push("/admin/dashboard/court-stations")
    }
    const onCourtAssistantsLink = (e) => {
        e.preventDefault()
        router.history.push("/admin/dashboard/court-assistants")
    }
    const onAdvocatesLink = (e) => {
        e.preventDefault()
        router.history.push("/admin/dashboard/advocates")
    }
    const onDeputyRegistrarsLink = (e) => {
        e.preventDefault()
        router.history.push("/admin/dashboard/deputy-registrars")
    }

    return <Nav pills vertical  className="bd-links" id="bd-docs-nav">
        <NavItem>
            <NavLink href="" onClick={onCourtStationsLink} active={active === 'court-station'}>Court Stations</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="" onClick={onCaseFormsLink} active={active === 'case-forms'}>Case Forms</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="" onClick={onCaseCategoriesLink} active={active === 'case-categories'}>Case categories</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="" onClick={onAdvocatesLink} active={active === 'advocates'}>Advocates</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="" onClick={onCourtAssistantsLink} active={active === 'court-assistants'}>Court assistants</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="" onClick={onDeputyRegistrarsLink} active={active === 'deputy-registrars'}>Deputy registrars</NavLink>
        </NavItem>

    </Nav>


}
