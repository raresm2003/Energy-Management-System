import React from 'react';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import DeviceAddForm from "./components/device-add-form";
import DeviceUpdateForm from "./components/device-update-form";
import * as API_DEVICES from "./api/device-api";
import DeviceTable from "./components/device-table";

class DeviceContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addFormOpen: false,
            updateFormOpen: false,
            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null,
            selectedDevice: null,
        };
    }

    componentDidMount() {
        this.fetchDevices();
    }

    fetchDevices = () => {
        const { userId, userRole } = this.props;

        if (userRole === 'user') {
            API_DEVICES.getUserDevices(userId, (result, status, err) => {
                if (result !== null && status === 200) {
                    this.setState({ tableData: result, isLoaded: true });
                } else {
                    this.setState({ errorStatus: status, error: err });
                }
            });
        } else {
            API_DEVICES.getDevices((result, status, err) => {
                if (result !== null && status === 200) {
                    this.setState({ tableData: result, isLoaded: true });
                } else {
                    this.setState({ errorStatus: status, error: err });
                }
            });
        }
    }

    toggleAddForm = () => {
        this.setState({ addFormOpen: !this.state.addFormOpen });
    }

    toggleUpdateForm = () => {
        this.setState({ updateFormOpen: !this.state.updateFormOpen });
    }

    reload = (closeFormType = null) => {
        this.setState({ isLoaded: false }, () => {
            this.fetchDevices();
            if (closeFormType === "add") {
                this.setState({ addFormOpen: false });
            } else if (closeFormType === "update") {
                this.setState({ updateFormOpen: false });
            }
        });
    };

    reloadAll = () => {
        this.setState({ isLoaded: false }, () => {
            this.fetchDevices();
        });
    };

    deleteDevice = (deviceId) => {
        API_DEVICES.deleteDevice(deviceId, (result, status, err) => {
            if (status === 200 || status === 204) {
                this.reload();
            } else {
                this.setState({ errorStatus: status, error: err });
            }
        });
    }

    render() {
        const { userRole } = this.props;

        return (
            <div>
                <div style={{ padding: '20px' }}>
                    <Row>
                        <Col sm={{ size: '8', offset: 1 }}>
                            <h3>{userRole === 'user' ? 'My Devices' : 'Device Management'}</h3>
                            {userRole !== 'user' && (
                                <>
                                    <Button
                                        color="primary"
                                        onClick={this.toggleAddForm}
                                    >
                                        Add Device
                                    </Button>
                                    {' '}
                                    <Button
                                        color="warning"
                                        onClick={this.toggleUpdateForm}
                                        disabled={!this.state.selectedDevice}
                                    >
                                        Update Selected
                                    </Button>
                                    {' '}
                                    <Button
                                        color="danger"
                                        onClick={() => this.state.selectedDevice && this.deleteDevice(this.state.selectedDevice)}
                                        disabled={!this.state.selectedDevice}
                                    >
                                        Delete Selected
                                    </Button>
                                </>
                            )}
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col sm={{ size: '8', offset: 1 }}>
                            {this.state.isLoaded && (
                                <DeviceTable
                                    tableData={this.state.tableData}
                                    onDelete={this.deleteDevice}
                                    setSelectedDevice={(device) => this.setState({ selectedDevice: device })}
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
                    <ModalHeader toggle={this.toggleAddForm}>Add Device</ModalHeader>
                    <ModalBody>
                        <DeviceAddForm reloadHandler={() => this.reload("add")} />
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.updateFormOpen} toggle={this.toggleUpdateForm} size="lg">
                    <ModalHeader toggle={this.toggleUpdateForm}>Update Device</ModalHeader>
                    <ModalBody>
                        <DeviceUpdateForm
                            reloadHandler={() => this.reload("update")}
                            device={this.state.selectedDevice}
                        />
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default DeviceContainer;
