import React from 'react';
import {withRouter} from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import {Button, Glyphicon, OverlayTrigger, Table, Tooltip} from 'react-bootstrap';

const ProductRow = withRouter(({
                                   product, deleteProduct, index,
                               }) => {
    const viewTooltip = (
        <Tooltip id="view-tooltip" placement="top">View Picture</Tooltip>
    );

    const editTooltip = (
        <Tooltip id="edit-tooltip" placement="top">Edit Product</Tooltip>
    );

    const deleteTooltip = (
        <Tooltip id="delete-tooltip" placement="top">Delete Product</Tooltip>
    );

    function onDelete(e) {
        e.preventDefault();
        deleteProduct(index);
    }

    const tableRow = (
        <tr>
            <td>{product.id}</td>
            <td>{product.productName}</td>
            <td>${product.price}</td>
            <td>{product.category}</td>
            <td>
                <LinkContainer to={`/view/${product.id}`}>
                    <OverlayTrigger delayShow={1000} overlay={viewTooltip}>
                        <Button bsSize="xsmall">
                            <Glyphicon glyph="picture"/></Button>
                    </OverlayTrigger>
                </LinkContainer>
                {' '}
                <LinkContainer to={`/edit/${product.id}`}>
                    <OverlayTrigger delayShow={1000} overlay={editTooltip}>
                        <Button bsSize="xsmall">
                            <Glyphicon glyph="edit"/></Button>
                    </OverlayTrigger>
                </LinkContainer>
                {' '}
                <OverlayTrigger delayShow={1000} overlay={deleteTooltip}>
                    <Button bsSize="xsmall" onClick={onDelete}>
                        <Glyphicon glyph="trash"/>
                    </Button>
                </OverlayTrigger>
            </td>
        </tr>
    );

    return (
        <LinkContainer to={`/view/${product.id}`}>
            {tableRow}
        </LinkContainer>
    );

});

export default function ProductTable({ products, deleteProduct }) {
    const productRows = products.map((product, index) => (
        <ProductRow
            key={product.id}
            product={product}
            deleteProduct={deleteProduct}
            index={index}
        />
    ));

    return (
        <div>
            <Table bordered condensed hover responsive>
                <thead>
                <tr>
                    {/*<th>Mongo Id</th>*/}
                    <th>Id</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {productRows}
                </tbody>
            </Table>
        </div>
    );
}