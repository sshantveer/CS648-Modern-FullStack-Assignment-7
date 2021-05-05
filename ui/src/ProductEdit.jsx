import React from 'react';

import {graphQLFetch} from './graphQLFetch.js';

import NumInput from "./NumInput.jsx";
import TextInput from "./TextInput.jsx";
import {Button, ButtonToolbar, Col, ControlLabel, Form, FormControl, FormGroup, Panel, Alert,} from 'react-bootstrap';

export default class ProductEdit extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {},
            invalidFields: {},
            showingValidation: false
        };
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onValidityChange = this.onValidityChange.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        const { match: { params: { id: prevId } } } = prevProps;
        const { match: { params: { id } } } = this.props;
        if (id !== prevId) {
            this.loadData();
        }
    }

    onChange(event, naturalValue) {
        const { name, value: textValue } = event.target;
        const value = naturalValue === undefined ? textValue : naturalValue;
        this.setState(prevState => ({
            product: { ...prevState.product, [name]: value },
        }));
    }

    onValidityChange(event, valid) {
        const { name } = event.target;
        this.setState((prevState) => {
            const invalidFields = { ...prevState.invalidFields, [name]: !valid };
            if (valid) delete invalidFields[name];
            return { invalidFields };
        });
    }

    showValidation() {
        this.setState({ showingValidation: true });
    }

    dismissValidation() {
        this.setState({ showingValidation: false });
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.showValidation();
        const { product, invalidFields } = this.state;
        if (Object.keys(invalidFields).length !== 0) return;

        const query = `mutation productUpdate(
              $id: Int!
              $changes: ProductUpdateInputs!
            ) {
              productUpdate(
                id: $id
                changes: $changes
              ) {
                id
                productName
                price
                category
                imageUrl
              }
            }`;

        const { id, created, ...changes } = product;
        const data = await graphQLFetch(query, { changes, id });
        if (data) {
            this.setState({ product: data.productUpdate });
            alert('Updated product successfully'); // eslint-disable-line no-alert
        }

        console.log(product); // eslint-disable-line no-console
    }

    async loadData() {
        const query = `query product($id: Int!) {
          product(id: $id) {
            id
            productName
            price
            category
            imageUrl
          }
        }`;

        const { match: { params: { id } } } = this.props;
        const data = await graphQLFetch(query, { id });
        this.setState({ product: data ? data.product : {}, invalidFields: {} });
    }

    render() {
        const { product: { id } } = this.state;
        const { match: { params: { id: propsId } } } = this.props;
        if (id == null) {
            if (propsId != null) {
                return <h3>{`Product with ID ${propsId} not found.`}</h3>;
            }
            return null;
        }

        const { invalidFields, showingValidation } = this.state;
        let validationMessage;
        if (Object.keys(invalidFields).length !== 0 && showingValidation) {
            validationMessage = (
                <Alert bsStyle="danger" onDismiss={this.dismissValidation}>
                    Please correct invalid fields before submitting.
                </Alert>
            );
        }

        const { product: { productName, price } } = this.state;
        const { product: { category, imageUrl } } = this.state;

        return (
            <Panel>
                <Panel.Heading>
                    <Panel.Title>{`Editing product: ${id}`}
                    </Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    <Form horizontal onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>Product Name:</Col>
                            <Col sm={9}>
                                <FormControl
                                    componentClass={TextInput}
                                    name="productName"
                                    value={productName}
                                    onChange={this.onChange}
                                    key={id}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>Category:</Col>
                            <Col sm={9}>
                                <FormControl
                                    componentClass="select"
                                    name="category"
                                    value={category}
                                    onChange={this.onChange}
                                >
                                    <option value="Shirts">Shirts</option>
                                    <option value="Jeans">Jeans</option>
                                    <option value="Jackets">Jackets</option>
                                    <option value="Sweaters">Sweaters</option>
                                    <option value="Accessories">Accessories</option>
                                </FormControl>
                            </Col>
                        </FormGroup>

                        <FormGroup validationState={
                            invalidFields.price ? 'error' : null
                        }>
                            <Col componentClass={ControlLabel} sm={3}>Price ($):</Col>
                            <Col sm={9}>
                                <FormControl
                                    componentClass={NumInput}
                                    name="price"
                                    value={price}
                                    onChange={this.onChange}
                                    key={id}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup validationState={
                            invalidFields.imageUrl ? 'error' : null
                        }>
                            <Col componentClass={ControlLabel} sm={3}>Image URL:</Col>
                            <Col sm={9}>
                                <FormControl
                                    componentClass={TextInput}
                                    name="imageUrl"
                                    value={imageUrl}
                                    onChange={this.onChange}
                                    key={id}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col smOffset={3} sm={6}>
                                <ButtonToolbar>
                                    <Button bsStyle="primary" type="submit">Submit</Button>
                                </ButtonToolbar>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col smOffset={3} sm={9}>{validationMessage}</Col>
                        </FormGroup>
                    </Form>

                </Panel.Body>
            </Panel>
        );
    }
}