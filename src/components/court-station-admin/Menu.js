import React from 'react'
import {Nav, NavItem, NavLink} from "reactstrap"


export default ({router, active}) => {
    const onCourtAssistantsLink = (e) => {
        e.preventDefault()
        router.history.push("/court-admin/dashboard/assistant")
    }

    const onDeputyRegistrarsLink = (e) => {
        e.preventDefault()
        router.history.push("/court-admin/dashboard/deputy-registrar")
    }

    return <Nav pills vertical  className="bd-links" id="bd-docs-nav">

        <NavItem>
            <NavLink href="" onClick={onCourtAssistantsLink} active={active === 'court-assistant'}>Court assistant</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="" onClick={onDeputyRegistrarsLink} active={active === 'deputy-registrar'}>Deputy registrar</NavLink>
        </NavItem>

    </Nav>


}
