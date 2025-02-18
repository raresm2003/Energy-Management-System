import React from 'react';
import validate from "./validators/device-validators";
import Button from "react-bootstrap/Button";
import * as API_DEVICES from "../api/device-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import { Col, Row, FormGroup, Input, Label } from 'reactstrap';

class DeviceAddForm extends React.Component {
    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {
            errorStatus: 0,
            error: null,
            formIsValid: false,
            formControls: {
                description: {
                    value: '',
                    placeholder: 'Device description...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                address: {
                    value: '',
                    placeholder: 'Device address...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true,
                        minLength: 1
                    }
                },
                maxhusage: {
                    value: '',
                    placeholder: 'Maximum hourly usage...',
                    valid: false,
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
    }

    toggleForm() {
        this.setState({ collapseForm: !this.state.collapseForm });
    }

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = this.state.formControls;
        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });
    };

    registerDevice(device) {
        return API_DEVICES.postDevice(device, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted device with id: " + result);
                this.reloadHandler();
            } else {
                this.setState({
                    errorStatus: status,
                    error: error
                });
            }
        });
    }

    handleSubmit() {
        let device = {
            description: this.state.formControls.description.value,
            address: this.state.formControls.address.value,
            maxhusage: this.state.formControls.maxhusage.value,
            userid: this.state.formControls.userid.value || null
        };

        console.log(device);
        this.registerDevice(device);
    }

    render() {
        return (
            <div>
                <FormGroup id='description'>
                    <Label for='descriptionField'>Description:</Label>
                    <Input name='description' id='descriptionField' placeholder={this.state.formControls.description.placeholder}
                        onChange={this.handleChange}
                        defaultValue={this.state.formControls.description.value}
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
                        defaultValue={this.state.formControls.address.value}
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
                        defaultValue={this.state.formControls.maxhusage.value}
                        touched={this.state.formControls.maxhusage.touched ? 1 : 0}
                        valid={this.state.formControls.maxhusage.valid}
                        required
                    />
                </FormGroup>

                <FormGroup id='userid'>
                    <Label for='useridField'>User ID (optional):</Label>
                    <Input name='userid' id='useridField' placeholder={this.state.formControls.userid.placeholder}
                        onChange={this.handleChange}
                        defaultValue={this.state.formControls.userid.value}
                        touched={this.state.formControls.userid.touched ? 1 : 0}
                        valid={this.state.formControls.userid.valid}
                    />
                </FormGroup>

                <Row>
                    <Col sm={{ size: '4', offset: 8 }}>
                        <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}>Submit</Button>
                    </Col>
                </Row>

                {this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error} />}
            </div>
        );
    }
}

export default DeviceAddForm;
