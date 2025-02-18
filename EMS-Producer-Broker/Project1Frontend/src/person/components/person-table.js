import React from "react";
import Table from "../../commons/tables/table";

const columns = [
    { Header: 'Username', accessor: 'username' },
    { Header: 'Role', accessor: 'role' },
    { Header: 'ID', accessor: 'id' }
];

const filters = [];

class PersonTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedRow: null };
    }

    handleRowClick = (row) => {
        this.setState({ selectedRow: row.id });
        this.props.setSelectedPerson(row.id);
    };

    render() {
        return (
            <div>
                <Table
                    data={this.props.tableData}
                    columns={columns}
                    search={filters}
                    pageSize={5}
                    onRowClick={this.handleRowClick}
                    selectedRow={this.state.selectedRow}
                />
            </div>
        );
    }
}

export default PersonTable;
