import React from 'react';
import {
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    ModalHeader,
    ModalFooter,
    ModalBody, Button, Modal, Dropdown
} from 'reactstrap'
import PropTypes from 'prop-types'

class TestModal extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {
        const {show, onClose} = this.props

        const {errors, isLoading, invalid, description, title, paid, tags,message} = this.state
        let {hosts} = this.state

        if (show) {
            return (
                <Modal isOpen={show} toggle={onClose} size="lg">
                    <ModalHeader toggle={onClose}>Create new podcast</ModalHeader>
                    <ModalBody>

                        <Dropdown group isOpen={this.state.dropdownOpen} size="sm" toggle={this.toggle}>
                            <DropdownToggle caret>
                                Dropdown
                            </DropdownToggle>
                            <DropdownMenu >
                                <DropdownItem >Action</DropdownItem>
                                <DropdownItem divider/>
                                <DropdownItem>Another Action</DropdownItem>
                                <DropdownItem divider/>
                                <DropdownItem>Another Action</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={onClose}>Cancel</Button>{' '}
                    </ModalFooter>
                </Modal>
            )
        }
        else return null
    }
}


TestModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}
TestModal.contextTypes = {
    router: PropTypes.object.isRequired
}

export default TestModal

