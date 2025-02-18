import React from 'react';
import validate from "./validators/person-validators";
import Button from "react-bootstrap/Button";
import * as API_USERS from "../api/person-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import { Col, Row, FormGroup, Input, Label } from 'reactstrap';

class PersonUpdateForm extends React.Component {
    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {
            errorStatus: 0,
            error: null,
            formIsValid: false,
            formControls: {
                username: {
                    value: '',
                    placeholder: 'Username...',
                    valid: true,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                password: {
                    value: '',
                    placeholder: 'Password...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 6,
                        isRequired: true
                    }
                },
                role: {
                    value: '',
                    placeholder: 'Role...',
                    valid: true,
                    touched: false,
                    validationRules: {
                        isRequired: true
                    }
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updatePerson = this.updatePerson.bind(this);
    }

    componentDidMount() {
        this.loadPersonData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.person && this.props.person !== prevProps.person) {
            this.loadPersonData();
        }
    }

    loadPersonData() {
        const personId = this.props.person;

        if (!personId) {
            return;
        }

        console.log(personId);

        API_USERS.getPersonById({ id: personId }, (result, status, error) => {
            if (result && status === 200) {
                const { username, role } = result;

                this.setState({
                    formControls: {
                        username: { ...this.state.formControls.username, value: username },
                        password: { ...this.state.formControls.password, value: '' },
                        role: { ...this.state.formControls.role, value: role }
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

    updatePerson(person) {
        API_USERS.putPerson(person.id, person, (result, status, error) => {
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

        const personId = this.props.person;

        if (!personId) {
            console.error("Person ID is missing.");
            return;
        }

        const person = {
            id: personId,
            username: this.state.formControls.username.value,
            password: this.state.formControls.password.value || null,
            role: this.state.formControls.role.value
        };

        this.updatePerson(person);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <FormGroup id='username'>
                        <Label for='usernameField'> Username: </Label>
                        <Input name='username' id='usernameField' placeholder={this.state.formControls.username.placeholder}
                            onChange={this.handleChange}
                            value={this.state.formControls.username.value}
                            touched={this.state.formControls.username.touched ? 1 : 0}
                            valid={this.state.formControls.username.valid}
                            required
                        />
                        {this.state.formControls.username.touched && !this.state.formControls.username.valid &&
                            <div className={"error-message"}> * Username must have at least 3 characters </div>}
                    </FormGroup>

                    <FormGroup id='password'>
                        <Label for='passwordField'> Password: </Label>
                        <Input name='password' id='passwordField'
                            type="password"
                            placeholder={this.state.formControls.password.value ? '' : 'Password...'}
                            onChange={this.handleChange}
                            value={this.state.formControls.password.value}
                            touched={this.state.formControls.password.touched ? 1 : 0}
                            valid={this.state.formControls.password.valid}
                        />
                        {this.state.formControls.password.touched && !this.state.formControls.password.valid &&
                            <div className={"error-message"}> * Password must have at least 6 characters </div>}
                    </FormGroup>

                    <FormGroup id='role'>
                        <Label for='roleField'> Role: </Label>
                        <Input name='role' id='roleField' placeholder={this.state.formControls.role.placeholder}
                            onChange={this.handleChange}
                            value={this.state.formControls.role.value}
                            touched={this.state.formControls.role.touched ? 1 : 0}
                            valid={this.state.formControls.role.valid}
                            required
                        />
                        {this.state.formControls.role.touched && !this.state.formControls.role.valid &&
                            <div className={"error-message"}> * Role is required </div>}
                    </FormGroup>

                    <Row>
                        <Col sm={{ size: '4', offset: 8 }}>
                            <Button type="submit" disabled={!this.state.formIsValid}> Update </Button>
                        </Col>
                    </Row>
                </form>

                {this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error} />}
            </div>
        );
    }
}

export default PersonUpdateForm;
