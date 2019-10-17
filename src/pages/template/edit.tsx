import React from 'react';
import { Form, Card, Input, InputNumber, Radio, Button, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import CascaderCity from '@/components/cascader-city';
import classnames from 'classnames';
import styles from './style.module.scss';
import { FormComponentProps } from 'antd/es/form';
import { radioStyle } from '@/config';
import { templateAdd } from './api';
import { RadioChangeEvent } from 'antd/lib/radio';
interface State {
  visible: boolean;
  templateData: any[];
  areas: any[];
}
interface Fields {
  templateName: string;
  commonCost: number;
}

interface rankItem {
  rankNo: number;
  destination: string;
  rankType: number;
  cost?: number;
}
let rankNo = 1;
const map = (list: any[]) => {
  return list.map((item: any) => {
    return {
      rankNo: item.rankNo,
      rankType: item.rankType,
      cost: item.cost * 100,
      destination: item.areas.map((v: any) => v.id).join(',')
    }
  })
}
class edit extends React.Component<FormComponentProps<Fields>, State> {
  state: State = {
    visible: false,
    templateData: [],
    areas: []
  };
  haveSave = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const params = {
          templateName: values.templateName,
          commonCost: values.commonCost * 100,
          rankList: map(this.state.templateData)
        };
        templateAdd(params)
      }
    })
  }
  render() {
    const { form: { getFieldDecorator } } = this.props;
    const editColumns: ColumnProps<rankItem>[] = [
      {
        title: '编号',
        dataIndex: 'rankNo',
        key: 'rankNo',
        width: 80
      },
      {
        title: '目的地',
        dataIndex: 'areas',
        key: 'areas',
        render: (areas: any) => {
          return (
            <div className={styles.areas}>
              <div style={{ maxWidth: '90%' }}>{areas.map((v: any) => <span key={v.id}>{v.name}（{v.children.length}）</span>)}</div>
              <div className={styles.operate}>
                <Button type="link" onClick={() => {
                  this.setState({
                    areas,
                    visible: true
                  })
                }}>编辑</Button>
              </div>
            </div>
          );
        },
      },
      {
        title: '运费/元',
        key: 'fare',
        render: (text: any, record: rankItem, index: number) => {
          return (
            <Radio.Group onChange={(e: RadioChangeEvent) => {
              const { templateData } = this.state;
              templateData[index].rankType = e.target.value;
              this.setState({
                templateData
              })
            }} value={record.rankType}>
              <Radio value={1} style={radioStyle}>
                <InputNumber
                  value={record.cost}
                  onChange={(value: any) => {
                    const { templateData } = this.state;
                    templateData[index].cost = value;
                    this.setState({
                      templateData
                    })
                  }}
                  min={0.01}
                  style={{ width: 80 }} />
              </Radio>
              <Radio value={0} style={radioStyle}>不发货</Radio>
            </Radio.Group>
          );
        },
      },
      {
        title: '操作',
        key: 'operate',
        render: (text: any, record: rankItem, index: number) => {
          return <Button type="link" onClick={() => {
            this.setState({
              templateData: this.state.templateData.filter((v: rankItem) => v.rankNo !== record.rankNo)
            })
          }}>删除</Button>;
        },
      },
    ];
    return (
      <>
        <CascaderCity
          visible={this.state.visible}
          onChange={(checkedResult: any) => {
            console.log("result", checkedResult)
          }}
          onOk={(areas: any) => {
            console.log('areas=>', areas);
            const { templateData } = this.state;
            this.setState({
              templateData: [...templateData, { areas, rankNo: rankNo++, rankType: 1 }],
              visible: false
            });
          }}
          onCancel={() => {
            this.setState({
              visible: false
            })
          }}
        />
        <Card title="运费模板设置">
          <Form labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="模板名称" required={true}>
              {getFieldDecorator('templateName', {
                rules: [{
                  required: true,
                  message: '请输入模板名称'
                }]
              })(<Input style={{ width: 200 }} />)}
            </Form.Item>
            <Form.Item label="运费设置">
              <Card
                type="inner"
                title={
                  <Form.Item required={true}>
                    <span>默认运费：</span>
                    {getFieldDecorator('commonCost', {
                      rules: [{
                        required: true,
                        message: '请输入默认运费'
                      }]
                    })(<InputNumber min={0.01} style={{ width: 80 }} />)}
                    <span className="ml10">元</span>
                  </Form.Item>
                }
              >
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({ visible: true });
                  }}
                >
                  为指定地区添加运费
                </Button>
                <Table
                  rowKey="rankNo"
                  className={classnames('mt10', styles.fare)}
                  columns={editColumns}
                  dataSource={this.state.templateData}
                ></Table>
              </Card>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 2 }}>
              <Button type="primary" onClick={this.haveSave}>保存</Button>
            </Form.Item>
          </Form>
        </Card>
      </>
    );
  }
}
export default Form.create()(edit);
