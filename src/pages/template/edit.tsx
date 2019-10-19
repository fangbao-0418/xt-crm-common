import React from 'react';
import { Form, Card, Input, InputNumber, Radio, Button, Table, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import CascaderCity from '@/components/cascader-city';
import classnames from 'classnames';
import styles from './style.module.scss';
import { withRouter } from 'react-router';
import { radioStyle } from '@/config';
import { templateAdd, templateModify } from './api';
import { RadioChangeEvent } from 'antd/lib/radio';
import { getDetail } from './api';
import { formatPrice } from '@/util/format';
import { rankItem, Props, State } from './interface';


const mapReqRankList = (list: rankItem[]) => {
  return list.map((item: any) => {
    let { destinationList, ...rest } = item;
    return {
      ...rest,
      cost: item.cost * 100,
      destinationList,
      describe:
        destinationList &&
        destinationList.map((v: any) => `${v.name}（${v.children.length})`).join(' '),
    };
  });
};
const mapResRankList = (list: rankItem[] = []) => {
  return list.map((item: rankItem) => {
    return {
      ...item,
      cost: item.cost && formatPrice(item.cost),
    };
  });
};
class edit extends React.Component<Props, State> {
  // editIndex等于-1为添加
  editIndex: number = -1;
  rankNo: number = 1;
  state: State = {
    visible: false,
    templateData: [],
    destinationList: [],
  };
  async getDetail() {
    const res = (await getDetail(this.props.match.params.id)) || {};
    this.props.form.setFieldsValue({
      templateName: res.templateName,
      commonCost: formatPrice(res.commonCost),
    });
    let templateData = mapResRankList(res.rankList);
    this.rankNo = templateData.length + 1;
    this.setState({
      templateData,
    });
  }
  componentDidMount() {
    if (this.props.match.params.id) {
      this.getDetail();
    }
  }
  haveSave = () => {
    this.props.form.validateFields(async (errors, values) => {
      let { templateData } = this.state;
      if (!errors) {
        if (templateData.some((item: rankItem) => item.rankType === 1 && !item.cost)) {
          message.error('发货地区运费是必填项');
          return;
        }
        const params = {
          templateName: values.templateName,
          commonCost: values.commonCost * 100,
          rankList: mapReqRankList(templateData),
        };
        let res = false;
        let { id } = this.props.match.params;
        if (id) {
          res = await templateModify({
            freightTemplateId: id,
            ...params,
          });
        } else {
          res = await templateAdd(params);
        }
        if (res) {
          message.success('保存成功');
          this.props.history.push('/template/page');
        }
      }
    });
  };
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const editColumns: ColumnProps<rankItem>[] = [
      {
        title: '编号',
        dataIndex: 'rankNo',
        key: 'rankNo',
        width: 80,
      },
      {
        title: '目的地',
        dataIndex: 'destinationList',
        key: 'destinationList',
        render: (destinationList: any = [], record: rankItem, index: number) => {
          return (
            <div className={styles.areas}>
              <div style={{ maxWidth: '90%' }}>
                {destinationList.map((v: any) => (
                  <span key={v.id}>
                    {v.name}（{v.children.length}）
                  </span>
                ))}
              </div>
              <div className={styles.operate}>
                <Button
                  type="link"
                  onClick={() => {
                    this.setState({
                      destinationList,
                      visible: true,
                    });
                    this.editIndex = index;
                  }}
                >
                  编辑
                </Button>
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
            <Radio.Group
              onChange={(e: RadioChangeEvent) => {
                const { templateData } = this.state;
                templateData[index].rankType = e.target.value;
                this.setState({
                  templateData,
                });
              }}
              value={record.rankType}
            >
              <Radio value={1} style={radioStyle}>
                <InputNumber
                  placeholder="请输入"
                  value={record.cost}
                  onChange={(value: any) => {
                    const { templateData } = this.state;
                    templateData[index].cost = value;
                    this.setState({
                      templateData,
                    });
                  }}
                  min={0.01}
                  style={{ width: 80 }}
                />
              </Radio>
              <Radio value={0} style={radioStyle}>
                不发货
              </Radio>
            </Radio.Group>
          );
        },
      },
      {
        title: '操作',
        key: 'operate',
        render: (text: any, record: rankItem, index: number) => {
          return (
            <Button
              type="link"
              onClick={() => {
                this.setState({
                  templateData: this.state.templateData.filter(
                    (v: rankItem) => v.rankNo !== record.rankNo,
                  ),
                });
              }}
            >
              删除
            </Button>
          );
        },
      },
    ];
    return (
      <>
        <CascaderCity
          visible={this.state.visible}
          // value={this.state.destinationList}
          onChange={(checkedResult: any) => {
            console.log('result', checkedResult);
          }}
          onOk={(destinationList: any) => {
            let { templateData } = this.state;
            if (this.editIndex > -1) {
              templateData[this.editIndex].destinationList = destinationList;
            } else {
              templateData = [...templateData, { destinationList, rankNo: this.rankNo++, rankType: 1 }];
            }
            this.setState({
              templateData,
              visible: false,
            });
          }}
          onCancel={() => {
            this.setState({
              visible: false,
            });
          }}
        />
        <Card title="运费模板设置">
          <Form labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="模板名称" required={true}>
              {getFieldDecorator('templateName', {
                rules: [
                  {
                    required: true,
                    message: '请输入模板名称',
                  },
                ],
              })(<Input placeholder="请输入模板名称" style={{ width: 200 }} />)}
            </Form.Item>
            <Form.Item label="运费设置">
              <Card
                type="inner"
                title={
                  <Form.Item required={true}>
                    <span>默认运费：</span>
                    {getFieldDecorator('commonCost', {
                      rules: [
                        {
                          required: true,
                          message: '请输入默认运费',
                        },
                      ],
                    })(<InputNumber placeholder="请输入" min={0.01} style={{ width: 80 }} />)}
                    <span className="ml10">元</span>
                  </Form.Item>
                }
              >
                <Button
                  type="primary"
                  onClick={() => {
                    this.editIndex = -1;
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
              <Button type="primary" onClick={this.haveSave}>
                保存
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </>
    );
  }
}
export default Form.create()(withRouter(edit));
