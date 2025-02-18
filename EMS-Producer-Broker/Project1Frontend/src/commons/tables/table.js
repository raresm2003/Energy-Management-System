import React, { Component } from "react";
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Field from "./fields/Field";
import { Col, Row } from "react-bootstrap";

class Table extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            columns: props.columns,
            search: props.search,
            filters: [],
            selectedRow: null
        };
    }

    filter(data) {
        let accepted = true;

        this.state.filters.forEach(val => {
            if (String(val.value) === "") {
                accepted = true;
            }

            if (!String(data[val.accessor]).includes(String(val.value)) && !String(val.value).includes(String(data[val.accessor]))) {
                accepted = false;
            }
        });

        return accepted;
    }

    handleChange(value, index, header) {
        const filters = this.state.filters || [];

        const newFilters = [...filters];
        newFilters[index] = {
            value: value.target.value,
            accessor: header
        };

        this.setState({ filters: newFilters });
    }

    handleRowClick = (row) => {
        const { selectedRow } = this.state;
        const newSelectedRow = selectedRow === row.id ? null : row.id;
        this.setState({ selectedRow: newSelectedRow });
        if (this.props.onRowClick) {
            this.props.onRowClick(row);
        }
    }

    getTRPropsType = (state, rowInfo) => {
        if (rowInfo) {
            return {
                style: {
                    textAlign: "center",
                    background: this.state.selectedRow === rowInfo.original.id ? 'lightblue' : 'white'
                },
                onClick: () => this.handleRowClick(rowInfo.original)
            };
        }
        return {};
    }

    render() {
        let data = this.state.data ? this.state.data.filter(row =>
            Object.values(row).some(val => val !== null && val !== '')
        ) : [];

        const columns = this.state.columns.map(col => ({
            ...col,
            Header: () => <div style={{ backgroundColor: '#f2f2f2', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>{col.Header}</div>,
            minWidth: 150
        }));

        return (
            <div>
                <Row>
                    {
                        this.state.search.map((header, index) => {
                            return (
                                <Col key={index}>
                                    <div >
                                        <Field id={header.accessor} label={header.accessor}
                                            onChange={(e) => this.handleChange(e, index, header.accessor)} />
                                    </div>
                                </Col>
                            )
                        })
                    }
                </Row>
                <Row>
                    <Col>
                        <ReactTable
                            data={data}
                            resolveData={data => data.map(row => row)}
                            columns={columns}
                            showPagination={false}
                            pageSize={data.length}
                            style={{
                                width: '130%',
                                height: 'auto'
                            }}
                            getTrProps={this.getTRPropsType}
                        />
                    </Col>
                </Row>
            </div>
        );
    }

}

export default Table;
