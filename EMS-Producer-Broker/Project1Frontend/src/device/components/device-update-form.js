import React from 'react';
import validate from "./validators/device-validators";
import Button from "react-bootstrap/Button";
import * as API_DEVICES from "../api/device-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import { Col, Row, FormGroup, Input, Label } from 'reactstrap';

class DeviceUpdateForm extends React.Component {
    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {
            errorStatus: 0,
            error: null,
            formIsValid: false,
            formControls: {
                description: {
                    value: '',
                    placeholder: 'Device description...',
                    valid: true,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                address: {
                    value: '',
                    placeholder: 'Device address...',
                    valid: true,
                    touched: false,
                    validationRules: {
                        isRequired: true,
                        minLength: 1
                    }
                },
                maxhusage: {
                    value: '',
                    placeholder: 'Maximum hourly usage...',
                    valid: true,
                    touched: false,
                    validationRules: {
                        isNumber: true,
                        isRequired: true,
                        minValue: 0
                    }
                },
                userid: {
                    value: '',
                    placeholder: 'User ID (optional)...',
                    valid: true,
                    touched: false,
                    validationRules: {}
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateDevice = this.updateDevice.bind(this);
    }

    componentDidMount() {
        this.loadDeviceData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.device && this.props.device !== prevProps.device) {
            this.loadDeviceData();
        }
    }

    loadDeviceData() {
        const deviceId = this.props.device;

        if (!deviceId) {
            return;
        }

        API_DEVICES.getDeviceById({ id: deviceId }, (result, status, error) => {
            if (result && status === 200) {
                const { description, address, maxhusage, userid } = result;

                this.setState({
                    formControls: {
                        description: { ...this.state.formControls.description, value: description },
                        address: { ...this.state.formControls.address, value: address },
                        maxhusage: { ...this.state.formControls.maxhusage, value: maxhusage },
                        userid: { ...this.state.formControls.userid, value: userid || '' }
                    }
                });
            } else {
                this.setState({
                    errorStatus: status,
                    error: error
                });
            }
        });
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = { ...this.state.formControls };
        const updatedFormElement = { ...updatedControls[name] };

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let formElement in updatedControls) {
            formIsValid = updatedControls[formElement].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });
    }

    updateDevice(device) {
        API_DEVICES.putDevice(device.id, device, (result, status, error) => {
            if (result && (status === 200 || status === 204)) {
                this.reloadHandler();
                this.props.toggleForm();
            } else {
                this.setState({
                    errorStatus: status,
                    error: error
                });
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const deviceId = this.props.device;

        if (!deviceId) {
            console.error("Device ID is missing.");
            return;
        }

        const device = {
            id: deviceId,
            description: this.state.formControls.description.value,
            address: this.state.formControls.address.value,
            maxhusage: this.state.formControls.maxhusage.value,
            userid: this.state.formControls.userid.value || null
        };

        this.updateDevice(device);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <FormGroup id='description'>
                        <Label for='descriptionField'>Description:</Label>
                        <Input name='description' id='descriptionField' placeholder={this.state.formControls.description.placeholder}
                            onChange={this.handleChange}
                            value={this.state.formControls.description.value}
                            touched={this.state.formControls.description.touched ? 1 : 0}
                            valid={this.state.formControls.description.valid}
                            required
                        />
                        {this.state.formControls.description.touched && !this.state.formControls.description.valid &&
                            <div className={"error-message"}>* Description must have at least 3 characters</div>}
                    </FormGroup>

                    <FormGroup id='address'>
                        <Label for='addressField'>Address:</Label>
                        <Input name='address' id='addressField' placeholder={this.state.formControls.address.placeholder}
                            onChange={this.handleChange}
                            value={this.state.formControls.address.value}
                            touched={this.state.formControls.address.touched ? 1 : 0}
                            valid={this.state.formControls.address.valid}
                            required
                        />
                    </FormGroup>

                    <FormGroup id='maxhusage'>
                        <Label for='maxhusageField'>Max Hourly Usage:</Label>
                        <Input name='maxhusage' id='maxhusageField' placeholder={this.state.formControls.maxhusage.placeholder}
                            type="number" min={0}
                            onChange={this.handleChange}
                            value={this.state.formControls.maxhusage.value}
                            touched={this.state.formControls.maxhusage.touched ? 1 : 0}
                            valid={this.state.formControls.maxhusage.valid}
                            required
                        />
                    </FormGroup>

                    <FormGroup id='userid'>
                        <Label for='useridField'>User ID (optional):</Label>
                        <Input name='userid' id='useridField' placeholder={this.state.formControls.userid.placeholder}
                            onChange={this.handleChange}
                            value={this.state.formControls.userid.value}
                            touched={this.state.formControls.userid.touched ? 1 : 0}
                            valid={this.state.formControls.userid.valid}
                        />
                    </FormGroup>

                    <Row>
                        <Col sm={{ size: '4', offset: 8 }}>
                            <Button type="submit" disabled={!this.state.formIsValid}>Update Device</Button>
                        </Col>
                    </Row>
                </form>

                {this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error} />}
            </div>
        );
    }
}

export default DeviceUpdateForm;
