import React, { PureComponent } from 'react';
import { Table, Row, Col } from 'antd';
import { setQuery, parseQuery } from '@/util/utils';
import SearchForm from '../search-form';
import styles from './index.module.scss';

const formConfig = {
    options: [
        {
            type: 'input',
            id: 'name',
            label: '名称'
        }, {
            type: 'date',
            id: 'customTime',
            label: '时间'
        }
    ]
}

const table2Config = {
    columns: [],
    page: 1,
    total: 100
}

export default class extends PureComponent {

    componentDidMount() {
        this.handleSearch()
    }
    handleSearch = () => {
        const payload = parseQuery();
        console.log(payload, '触发')
    }
    render() {
        const { searchFormConfig = formConfig, tableConfig = table2Config } = this.props;
        return (
            <Row>
                <Col className={styles.searchForm}>
                    <SearchForm
                        {...searchFormConfig}
                        handleSearch={this.handleSearch}
                    />
                </Col>
                <Col>
                    <CommonTable
                        {...tableConfig}
                        handleSearch={this.handleSearch}
                    />
                </Col>
            </Row>
        )
    }
}

class CommonTable extends PureComponent {

    showTotal = total => {
        return <span>共{total}条数据</span>
    }

    onChange = (pageConfig) => {
        console.log(pageConfig, 'pageconfig');
        const { current, pageSize } = pageConfig;
        const { handleSearch } = this.props;
        setQuery({
            page: current,
            pageSize
        });
        typeof handleSearch === 'function' && handleSearch();
    }
    
    render() {
        const { columns = [], dataSource = [], total = 0, current, ...others } = this.props;
        return (
            <Table
                {...others}
                dataSource={dataSource}
                columns={columns}
                pagination={{
                    total: total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: this.showTotal,
                    // current
                }}
                onChange={this.onChange}
            />
        );
    }
}