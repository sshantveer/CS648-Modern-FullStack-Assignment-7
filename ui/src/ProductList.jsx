/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM PropTypes */
/* eslint "react/jsx-no-undef": "off" */
/* eslint "react/no-multi-comp": "off" */

import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';

import {graphQLFetch} from './graphQLFetch.js';
import ProductAdd from './ProductAdd.jsx';
import ProductTable from "./ProductTable.jsx";
import {Panel, Button} from "react-bootstrap";


export default class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            count: Int32Array
        };
        this.createProduct = this.createProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadCount() {
        const queryCount = `query { productCount }`;
        const responseCount = await graphQLFetch(queryCount);
        if(responseCount) {
            this.setState({count: responseCount.productCount});
        }
    }

    async loadData() {
        this.loadCount();

        const query = `query {
            productList {
                id
                productName
                price
                category
                imageUrl
            }
        }`;

        const response = await graphQLFetch(query);
        if(response) {
            this.setState({ products: response.productList});
        }
    }

    async createProduct(product) {
        const query = `mutation productAdd($product: ProductInputs!) {
            productAdd(product: $product) {
                id
            }
        }`;

        const data = await graphQLFetch(query, { product });
        if (data) {
            this.loadData();
        }
    }

    async deleteProduct(index) {
        const query = `mutation productDelete($id: Int!) {
          productDelete(id: $id)
        }`;
        const { products } = this.state;
        const { location: { pathname, search }, history } = this.props;
        const { id } = products[index];
        const data = await graphQLFetch(query, { id });
        if (data && data.productDelete) {
            this.setState((prevState) => {
                const newList = [...prevState.products];
                if (pathname === `/products/${id}`) {
                    history.push({ pathname: '/products', search });
                }
                newList.splice(index, 1);
                this.loadCount();
                return { products: newList };
            });
        } else {
            this.loadData();
        }
    }

    render() {
        const { products, count } = this.state;
        return (
            <React.Fragment>
                <Panel>
                    <Panel.Heading>
                        <Panel.Title toggle>
                            Filter
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body collapsible>
                    </Panel.Body>
                </Panel>
                <span>Showing <b>{count}</b> available products</span>
                <hr/>
                <ProductTable products={products} deleteProduct={this.deleteProduct}/>
                <hr/>
                <ProductAdd createProduct={this.createProduct}/>
            </React.Fragment>
        )
    }
}