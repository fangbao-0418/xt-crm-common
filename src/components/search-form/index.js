import React, { PureComponent } from 'react';
import { Input, Select, DatePicker, Form, Button } from 'antd';
import { firstLetterToUpperCase, setQuery, parseQuery } from '@/util/utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
// const dateFormat = 'YYYY-MM-DD HH:mm:ss';
@Form.create()
export default class extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            initParams: parseQuery()
        }
    }

    renderInput = (item) => {
        return (
            <Input />
        )
    }

    renderDate = (item) => {
        return (
            <RangePicker />
        )
    }

    renderSelect = (item) => {
        const { options } = item;
        return (
            <Select>
                {
                    options.map(({ label, value }) => (<Option value={value} key={value}>{label}</Option>))
                }
            </Select>
        )
    }

    handleSearch = () => {
        const { form: { validateFields }, handleSearch } = this.props;

        validateFields((errors, values) => {
            if (!errors) {
                const { customTime = [], ...other } = values;
                const payload = {
                    ...other,
                    startTime: customTime[0] && customTime[0].unix(),
                    endTime: customTime[1] && customTime[1].unix(),
                }
                setQuery(payload);
                typeof handleSearch === 'function' && handleSearch();
            }
        });
    }

    resetFields = () => {
        const { form: { resetFields } } = this.props;
        resetFields();
        this.handleSearch();
    }

    render() {
        const { options = [], form: { getFieldDecorator } } = this.props;
        const { initParams } = this.state;
        return (
            <Form layout="inline">
                {
                    options.map(item => {
                        const { type = '', id = '', label = '', config = {} } = item;
                        const renderFun = this[`render${firstLetterToUpperCase(type)}`];
                        return (
                            <FormItem label={label} key={item.id}>
                                {
                                    getFieldDecorator(id, {
                                        initialValue: initParams[id] || '',
                                        ...config
                                    })(
                                        renderFun && renderFun(item)
                                    )
                                }
                            </FormItem>
                        )
                    })
                }
                <FormItem>
                    <Button type="primary" onClick={this.handleSearch}>查询</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" style={{ marginRight: 10 }} onClick={this.resetFields}>清除条件</Button>
                </FormItem>
            </Form>
        );
    }
}