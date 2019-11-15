import React from 'react';
import { Table, Card, Button, Modal, message, Input, Select } from 'antd';
import Form, { FormComponentProps } from 'antd/lib/form'

// 搜索头部组件

interface Props extends FormComponentProps {
    className?: string
    onChange?: (value: any) => void
  }
class Main extends React.Component<Props> {
    public constructor (props: Props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    // 提交事件
    public handleSubmit () {
        this.props.form.validateFields((value: Special.SearchProps) => {

        })
    }

    public render () {
        const { getFieldDecorator } = this.props.form
        return (
            <div style={{
                display: 'inline-block',
                verticalAlign: 'middle'
            }}
            className={this.props.className}
            >
                <Form layout="inline">
                    <Form.Item label="模板标题">
                        {
                            getFieldDecorator('title')(
                                <Input placeholder='请输入模板标题'></Input>
                            )
                        }
                    </Form.Item>
                    <Form.Item label="模板类型">
                        {
                            getFieldDecorator('type')(
                                <Select allowClear style={{width: 100}}>
                                    <Select.Option value={0}>全部</Select.Option>
                                    <Select.Option value={1}>已启用</Select.Option>
                                    <Select.Option value={2}>已禁用</Select.Option>
                                </Select>
                            )
                        }
                    </Form.Item>
                </Form>
            </div>
        )
    }
}