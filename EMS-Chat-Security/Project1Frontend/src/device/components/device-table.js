import React from "react";
import Table from "../../commons/tables/table";

const columns = [
    { Header: 'Description', accessor: 'description' },
    { Header: 'Address', accessor: 'address' },
    { Header: 'Max Usage', accessor: 'maxhusage' },
    { Header: 'User ID', accessor: 'userid' }
];

const filters = [];

class DeviceTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedRow: null };
    }

    handleRowClick = (row) => {
        this.setState({ selectedRow: row.id });
        this.props.setSelectedDevice(row.id);
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

export default DeviceTable;
