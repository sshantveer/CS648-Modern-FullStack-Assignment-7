import React from 'react';
import PropTypes from 'prop-types';
import {Panel} from "react-bootstrap";
import {
    Form, ButtonToolbar, Table, Button, FormGroup, FormControl, ControlLabel, InputGroup,
} from 'react-bootstrap';

export default class ProductAdd extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.productAdd;
        const product = {
            productName: form.productName.value,
            price: form.price.value,
            category: form.category.value,
            imageUrl: form.imageUrl.value,
        }
        this.props.createProduct(product);
        form.productName.value = "";
        form.price.value = "";
        form.category.value = "";
        form.imageUrl.value = "";
    }

    render() {
        return (
            <div>
                <Panel>
                    <Panel.Heading>
                        <Panel.Title>
                            Add a new product to inventory
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <Form inline name="productAdd" onSubmit={this.handleSubmit}>

                            <FormGroup>
                                <ControlLabel>Category:</ControlLabel>
                                <FormControl
                                    componentClass="select" id="category" name="category">
                                    <option value="Shirts">Shirts</option>
                                    <option value="Jeans">Jeans</option>
                                    <option value="Jackets">Jackets</option>
                                    <option value="Sweaters">Sweaters</option>
                                    <option value="Accessories">Accessories</option>
                                </FormControl>
                            </FormGroup>
                            {' | '}
                            <FormGroup>
                                <ControlLabel>Price Per Unit:</ControlLabel>
                                <FormControl id="price" name="price" placeholder={"$"}>
                                </FormControl>
                            </FormGroup>
                            {' | '}
                            <FormGroup>
                                <ControlLabel>Product Name:</ControlLabel>
                                <FormControl id="productName" name={"productName"}></FormControl>
                            </FormGroup>
                            {' | '}
                            <FormGroup>
                                <ControlLabel>Image URL:</ControlLabel>
                                <FormControl id="imageUrl" name={"imageUrl"}></FormControl>
                            </FormGroup>
                            {' | '}
                            <Button bsStyle="primary" type={"submit"} name="submit">Add Product</Button>
                        </Form>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}

ProductAdd.propTypes = {
    createProduct: PropTypes.func.isRequired,
};