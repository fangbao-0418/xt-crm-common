import React from 'react';
import { Form, Card, Input, InputNumber, Radio, Button, Table, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import CascaderCity from '@/components/cascader-city';
import classnames from 'classnames';
import styles from './style.module.scss';
import { withRouter } from 'react-router';
import { radioStyle } from '@/config';
import { getUniqueId } from '@/packages/common/utils/index'
import { flatten, intersectionWith, differenceWith, unionWith, isEqual } from 'lodash'
import { templateAdd, templateModify, getDetail } from './api';
import { RadioChangeEvent } from 'antd/lib/radio';
import { formatPrice } from '@/util/format';
import { rankItem, Props, State } from './interface';


const mapReqRankList = (list: rankItem[]) => {
  return list.map((item: any, index: number) => {
    let { destinationList, ...rest } = item;
    return {
      ...rest,
      cost: item.cost * 100,
      firstFeeNumber: item.firstFeeNumber,
      renewalNumber: item.renewalNumber,
      renewalCost: item.renewalCost * 100,
      destinationList,
      rankNo: index + 1,
      describe:
        destinationList &&
        destinationList.map((v: any) => `${v.name}（${v.children.length})`).join(' '),
    };
  });
};
/**
 * 映射特定区域数组
 * {
 *  cost, // 金额
 *  describe,
 *  destinationList,
 *  rankNo,
 *  rankType
 * }[]
 * @param list 
 */
const mapTemplateData= (list: rankItem[]) => {
  return (list || []).map((item: rankItem) => {
    item = Object.assign({}, item)
    return {
      ...item,
      uid: item.uid || getUniqueId(),
      cost: item.cost && formatPrice(item.cost),
      firstFeeNumber: item.firstFeeNumber,
      renewalNumber: item.renewalNumber,
      renewalCost: formatPrice(item.renewalCost),
    };
  });
};

const flattenCity = (destinationList: any[]) => {
  const childArr = (destinationList || []).map(v => (v && v.children || []))
  return flatten(childArr)
}

const mapCitys = (list: rankItem[]) => {
  return (list || []).reduce((prev: any[], item: rankItem) => prev.concat(flattenCity(item.destinationList)), [])
}
class edit extends React.Component<Props, State> {
  // editIndex等于-1为添加
  editIndex: number = -1
  /** 所有市区组成的数组 */
  citys: any[] = []
  state: State = {
    visible: false,
    templateData: [],
    /** 通用省市区 */
    destinationList: [],
  };
  /**
   * 获取运费模板详情
   */
  async getDetail() {
    const res = (await getDetail(this.props.match.params.id)) || {};
    this.props.form.setFieldsValue({
      templateName: res.templateName,
      commonCost: formatPrice(res.commonCost),
      defaultNumber: res.defaultNumber,
      increaseNumber: res.increaseNumber,
      increaseCost: formatPrice(res.increaseCost)
    });
    let templateData = mapTemplateData(res.rankList);
    this.citys = mapCitys(res.rankList)
    this.setState({
      templateData,
    });
  }
  componentDidMount() {
    if (this.props.match.params.id) {
      this.getDetail();
    }
  }
  /** 处理table字段改变 */
  handleChange (partialValue: object, index: number) {
    const templateData = this.state.templateData
    templateData[index] = {
      ...templateData[index],
      ...partialValue
    }
    console.log(templateData, 'edit')
    this.setState({
      templateData
    })
  }
  /**
   * 新增编辑提交
   */
  haveSave = () => {
    this.props.form.validateFields(async (errors, values) => {
      let { templateData } = this.state;
      if (!errors) {
        if (templateData.some((item: rankItem) => item.rankType === 1 && item.cost !== 0 && !item.cost)) {
          message.error('发货地区运费是必填项');
          return;
        }
        const params = {
          templateName: values.templateName,
          commonCost: values.commonCost * 100,
          defaultNumber: values.defaultNumber,
          increaseNumber: values.increaseNumber,
          increaseCost: values.increaseCost * 100,
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
        key: 'index',
        width: 80,
        render: (text: any, record: rankItem, index: number) => {
          return index + 1;
        }
      },
      {
        title: '目的地',
        dataIndex: 'destinationList',
        key: 'destinationList',
        width: 150,
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
        title: '发货设置',
        key: 'fare',
        width: 100,
        render: (text: any, record: rankItem, index: number) => {
          return (
            <Radio.Group
              onChange={(e: RadioChangeEvent) => {
                const { templateData } = this.state;
                templateData[index].rankType = e.target.value;
                if (e.target.value === 0) {
                  templateData[index].cost = 0
                  templateData[index].firstFeeNumber = 1
                  templateData[index].firstFeeNumber = 1
                  templateData[index].renewalCost = 0
                } 
                this.setState({
                  templateData,
                });
              }}
              value={record.rankType}
            >
              <Radio value={1} style={radioStyle}>
                设置运费
              </Radio>
              <Radio value={0} style={radioStyle}>
                不发货
              </Radio>
            </Radio.Group>
          );
        },
      },
      {
        title: '首件数',
        dataIndex: 'firstFeeNumber',
        render: (text, record: rankItem, index: number) => {
          return record.rankType === 1 ? (
            <Form.Item>
              {getFieldDecorator(`firstFeeNumber[${record.uid}]`, {
                initialValue: text,
                rules: [
                  {
                    required: true,
                    message: '请输入件数',
                  },
                ],
              })(
                <InputNumber
                  placeholder="请输入件数"
                  precision={0}
                  onChange={(value: any) => {
                    this.handleChange({
                      firstFeeNumber: value
                    }, index)
                  }}
                  min={1}
                  max={9999}
                  style={{ width: 120 }}
                />
              )}
            </Form.Item>
          ) : '-';
        },
      },
      {
        title: '首费/元',
        dataIndex: 'cost',
        render: (text, record: rankItem, index: number) => {
          return record.rankType === 1 ? (
            <Form.Item>
              {getFieldDecorator(`cost[${record.uid}]`, {
                initialValue: text,
                rules: [
                  {
                    required: true,
                    message: '请输入金额',
                  },
                ],
              })(
                <InputNumber
                  placeholder="请输入金额"
                  value={text}
                  precision={2}
                  onChange={(value: any) => {
                    this.handleChange({
                      cost: value
                    }, index)
                  }}
                  min={0}
                  max={9999}
                  style={{ width: 120 }}
                />
              )}
            </Form.Item>
          ) : '-';
        },
      },
      {
        title: '续件数',
        dataIndex: 'renewalNumber',
        render: (text, record: rankItem, index: number) => {
          return record.rankType === 1 ? (
            <Form.Item>
              {getFieldDecorator(`renewalNumber[${record.uid}]`, {
                initialValue: text,
                rules: [
                  {
                    required: true,
                    message: '请输入件数',
                  },
                ],
              })(
                <InputNumber
                  placeholder="请输入件数"
                  value={text}
                  precision={0}
                  onChange={(value: any) => {
                    this.handleChange({
                      renewalNumber: value
                    }, index)
                  }}
                  min={1}
                  max={9999}
                  style={{ width: 120 }}
                />
              )}
            </Form.Item>
          ) : '-';
        },
      },
      {
        title: '续费',
        dataIndex: 'renewalCost',
        render: (text, record: rankItem, index) => {
          console.log(index, 'index')
          return record.rankType === 1 ? (
            <Form.Item>
              {getFieldDecorator(`renewalCost[${record.uid}]`, {
                initialValue: text,
                rules: [
                  {
                    required: true,
                    message: '请输入金额',
                  },
                ],
              })(
                <InputNumber
                  placeholder="请输入金额"
                  value={text}
                  precision={2}
                  onChange={(value: any) => {
                    this.handleChange({
                      renewalCost: value
                    }, index)
                  }}
                  min={0}
                  max={9999}
                  style={{ width: 120 }}
                />
              )}
            </Form.Item>
          ) : '-';
        },
      },
      {
        title: '操作',
        key: 'operate',
        align: 'center',
        render: (text: any, record: rankItem, index: number) => {
          return (
            <Button
              type="link"
              onClick={() => {
                this.setState((state) => {
                  const templateData = [...state.templateData]
                   /** 编辑的市区列表 */
                  const editCity = flattenCity(record.destinationList)
                  this.citys = differenceWith(this.citys, editCity, isEqual)
                  templateData.splice(index, 1)
                  console.log(index, templateData, 'templateData')
                  return {
                    templateData 
                  }
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
          value={this.state.destinationList}
          onOk={(destinationList: any) => {
            if (Array.isArray(destinationList) && destinationList.length === 0) {
              message.error('请选择地区')
              return
            }
            const checkedCity = flattenCity(destinationList)
            /** 求交集 */
            const intersect = intersectionWith(this.citys, checkedCity, isEqual)
            const msg = intersect.map(v => v.name).join(',')
            const isIntersect = intersect.length > 0
            let { templateData } = this.state;
            /** 编辑 */
            if (this.editIndex > -1) {
              /** 编辑的市区列表 */
              const editCity = flattenCity(templateData[this.editIndex].destinationList)
              /** 求编辑行选中目的地和citys的差集 */
              const diffCitys = differenceWith(this.citys, editCity, isEqual)
              /** 再和选中市区做交集比较，如果交集长度大于0，则不可以编辑，因为重复了 */
              const intersectCity = intersectionWith(checkedCity, diffCitys, isEqual)
              /** 排除自身 */
              if (intersectCity.length > 0) {
                const errorMsg = intersectCity.map(v => v.name).join(',')
                message.error(`${errorMsg}不能重复，请重新选择`)
                return
              }
              this.citys = diffCitys;
              templateData[this.editIndex].destinationList = destinationList;
            }
            /** 添加 */
            else {
              if (isIntersect) {
                message.error(`${msg}不能重复，请重新选择`)
                return
              }
              templateData = [...templateData, { uid: getUniqueId(), destinationList, rankType: 1, cost: '' }];
            }
            /** 求并集 */
            this.citys = unionWith(this.citys, checkedCity, isEqual)
            console.log(templateData, 'add')
            this.setState({
              destinationList,
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
                  <>
                    <Form.Item
                      required={true}
                      className='inline-block'
                    >
                      <span>默认运费：</span>
                      {getFieldDecorator('defaultNumber', {
                        rules: [
                          {
                            required: true,
                            message: '请输入默认件数',
                          },
                        ],
                      })(
                      <InputNumber
                        placeholder="请输入默认件数"
                        min={1}
                        max={9999}
                        precision={0}
                        style={{ width: 120 }}
                      />)}
                      <span className="ml10">件内，</span>
                    </Form.Item>
                    <Form.Item className='inline-block' required={true}>
                      {getFieldDecorator('commonCost', {
                        rules: [
                          {
                            required: true,
                            message: '请输入默认运费',
                          },
                        ],
                      })(
                      <InputNumber
                        placeholder="请输入默认运费"
                        min={0}
                        max={9999}
                        precision={2}
                        style={{ width: 120 }}
                      />)}
                      <span className="ml10">元，</span>
                    </Form.Item>
                    <Form.Item className='inline-block' required={true}>
                      <span>每增加 </span>
                      {getFieldDecorator('increaseNumber', {
                        rules: [
                          {
                            required: true,
                            message: '请输入增加件数',
                          },
                        ],
                      })(
                      <InputNumber
                        placeholder="请输入增加件数"
                        min={1}
                        max={9999}
                        precision={0}
                        style={{ width: 120 }}
                      />)}
                      <span className="ml10">件，</span>
                    </Form.Item>
                    <Form.Item className='inline-block' required={true}>
                      <span>运费增加 </span>
                      {getFieldDecorator('increaseCost', {
                        rules: [
                          {
                            required: true,
                            message: '请输入金额',
                          },
                        ],
                      })(
                      <InputNumber
                        placeholder="请输入金额"
                        min={0}
                        max={9999}
                        precision={2}
                        style={{ width: 120 }}
                      />)}
                      <span className="ml10">元</span>
                    </Form.Item>
                  </>
                }
              >
                <Button
                  type="primary"
                  onClick={() => {
                    this.editIndex = -1;
                    this.setState({
                      destinationList: [],
                      visible: true
                    });
                  }}
                >
                  为指定地区添加运费
                </Button>
                <Table
                  rowKey={'uid'}
                  className={classnames('mt10', styles.fare)}
                  columns={editColumns}
                  pagination={false}
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
