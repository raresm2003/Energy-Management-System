import React from 'react';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import PersonAddForm from "./components/person-add-form";
import PersonUpdateForm from "./components/person-update-form";
import * as API_USERS from "./api/person-api";
import PersonTable from "./components/person-table";

class PersonContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addFormOpen: false,
            updateFormOpen: false,
            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null,
            selectedPerson: null,
        };
    }

    componentDidMount() {
        this.fetchPersons();
    }

    fetchPersons = () => {
        const { token } = this.props; // Access the token from props
        console.log(token);
        API_USERS.getPersons(token, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({ tableData: result, isLoaded: true });
            } else {
                this.setState({ errorStatus: status, error: err });
            }
        });
    };

    toggleAddForm = () => {
        this.setState({ addFormOpen: !this.state.addFormOpen });
    }

    toggleUpdateForm = () => {
        this.setState({ updateFormOpen: !this.state.updateFormOpen });
    }

    reload = (closeFormType = null) => {
        this.setState({ isLoaded: false }, () => {
            this.fetchPersons();

            if (closeFormType === "add") {
                this.setState({ addFormOpen: false });
            } else if (closeFormType === "update") {
                this.setState({ updateFormOpen: false });
            }
        });
    };

    deletePerson = (personId) => {
        API_USERS.deletePerson(personId, (result, status, err) => {
            if (status === 200 || status === 204) {
                this.reload();
                if (this.props.reloadHandler) {
                    this.props.reloadHandler();
                }
            } else {
                this.setState({ errorStatus: status, error: err });
            }
        });
    };

    render() {
        return (
            <div>
                <div style={{ padding: '20px' }}>
                    <Row>
                        <Col sm={{ size: '8', offset: 1 }}>
                            <h3>User Management</h3>
                            <Button
                                color="primary"
                                onClick={this.toggleAddForm}
                            >
                                Add User
                            </Button>
                            {' '}
                            <Button
                                color="warning"
                                onClick={this.toggleUpdateForm}
                                disabled={!this.state.selectedPerson}
                            >
                                Update Selected
                            </Button>
                            {' '}
                            <Button
                                color="danger"
                                onClick={() => this.state.selectedPerson && this.deletePerson(this.state.selectedPerson)}
                                disabled={!this.state.selectedPerson}
                            >
                                Delete Selected
                            </Button>{' '}
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col sm={{ size: '8', offset: 1 }}>
                            {this.state.isLoaded && (
                                <PersonTable
                                    tableData={this.state.tableData}
                                    onDelete={this.deletePerson}
                                    setSelectedPerson={(person) => this.setState({ selectedPerson: person })}
                                />
                            )}
                            {this.state.errorStatus > 0 && (
                                <APIResponseErrorMessage
                                    errorStatus={this.state.errorStatus}
                                    error={this.state.error}
                                />
                            )}
                        </Col>
                    </Row>
                </div>

                <Modal isOpen={this.state.addFormOpen} toggle={this.toggleAddForm} size="lg">
                    <ModalHeader toggle={this.toggleAddForm}>Add User</ModalHeader>
                    <ModalBody>
                        <PersonAddForm reloadHandler={() => this.reload("add")} />
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.updateFormOpen} toggle={this.toggleUpdateForm} size="lg">
                    <ModalHeader toggle={this.toggleUpdateForm}>Update User</ModalHeader>
                    <ModalBody>
                        <PersonUpdateForm
                            reloadHandler={() => this.reload("update")}
                            person={this.state.selectedPerson}
                        />
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default PersonContainer;
