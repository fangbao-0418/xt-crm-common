import React from 'react';
import { Form, Input, Select, InputNumber, Card, Button, message, Table } from 'antd';
import { getCategory, saveRule, editRule } from './api';
import EditableTable from './editTable'
import './activity.scss'

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const formLayout = {
  labelCol: {
    xs: { span: 23 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 13 },
  },
};

class Add extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false, // 保存活动按钮
      categorys: []
    }
  }

  componentDidMount() {
    this.getCategory({level: 1});
  }

  //获得一级类目
  getCategory = params => {
    getCategory({ ...params }).then((res =[]) => {
      this.setState({
        categorys: res,
      });
    })
  }

  loadStatus(status) {
    this.loading = status;
    this.setState({
      loading: status
    })
  }

  handleSave = () => {
    const {
      form: { validateFields },
      onCancel,
      editSource,
      type
    } = this.props;

    validateFields((err, vals) => {
      if (!err) {
        console.log(vals)
        const { allCommissionRate } = vals
        const { categorys } = this.state
        let params = {
          ...vals,
          headCommissionRate: allCommissionRate[0].value,
          areaCommissionRate: allCommissionRate[1].value,
          cityCommissionRate: allCommissionRate[2].value,
          managerCommissionRate: allCommissionRate[3].value,
        };
        
        if(params){
          let category = categorys.filter(item => {
            return item.name === params.categoryId
          })
          params = Object.assign(params, {categoryId: category[0] && category[0].id})
        }
        delete params.allCommissionRate;
        console.log(params, 'params')
        if(type === "edit"){
          params.id = editSource.id;
          editRule({...params}).then(res => {
            if(res){
              onCancel()
            }
          })
        } else {
          saveRule({...params}).then(res => {
            if(res){
              onCancel()
            }
          })
        }
      }
    });
  };

  handleSaveNext = () => {
    const { history } = this.props;
    this.handleSave(id => {
      history.push(`/activity/info/edit/${id}`);
    });
  };

  disabledStartDate = startTime => {
    const { form } = this.props;
    const fieldsValue = form.getFieldsValue();
    const endTime = fieldsValue.endTime;
    if (!startTime || !endTime) {
      return false;
    }
    return startTime.valueOf() > endTime.valueOf();
  };

  disabledEndDate = endTime => {
    const { form } = this.props;
    const fieldsValue = form.getFieldsValue();
    const startTime = fieldsValue.startTime;
    if (!endTime || !startTime) {
      return false;
    }
    return endTime.valueOf() <= startTime.valueOf();
  };

  tagUrlChange = (files) => {
    if (files.length == 0) this.setState({
      tagUrl: ''
    })
    else this.setState({
      tagUrl: files[0].url
    })
  }
  tagPositionChange = (e) => {
    this.setState({
      place: e.target.value
    })
  }
  render() {
    const {
      form: { getFieldDecorator },
      onCancel,
      editSource,
      type
    } = this.props;
    const { categorys } = this.state;
    console.log(editSource, 'editSource')
    return (
      <Card className="activity-add">
        <Form {...formLayout}>
          <FormItem label="策略名称">
            {getFieldDecorator('name', {
              initialValue: editSource.name|| "",
              rules: [
                {
                  required: true,
                  message: '请输入正确的策略名称',
                },
              ],
            })(<Input maxLength={10} placeholder="请输入活动名称，10个字" />)}
          </FormItem>
          <FormItem label="目标类目">
            {getFieldDecorator('categoryId', {
              initialValue: editSource.categoryName|| "",
              rules: [
                {
                  required: true,
                  message: '请选择类目',
                },
              ]
            })(
              <Select style={{ width: 100 }}> 
                <Option value="">全部</Option>
                {
                  categorys.map(item => {
                    return <Option key={item.id} value={item.name}>{item.name}</Option>
                  })
                }
              </Select>,
            )}
          </FormItem>
          <FormItem label="类目利润比">
            {getFieldDecorator('categoryProfitRate', {
              initialValue: editSource.categoryProfitRate || 0,
              rules: [
                {
                  required: true,
                  message: '请输入类目利润比',
                },
              ],
            })(
              <InputNumber
                min={0}
                max={100}
                formatter={value => {
                  value = Number(value) < 0 ? 0 : Number(value) > 100 ? 100 : value;
                  return `${isNaN(Number(value).toFixed(0)) ? 0 : Number(value).toFixed(0)}%`
                }}
                parser={value => value.replace('%', '')}
              />
            )}
            <span>（输入范围为0~100内任意数值，仅支持整数）</span>
          </FormItem>
          <FormItem label="层级分佣比">
            {getFieldDecorator('allCommissionRate', {
                initialValue: type === 'edit' ? [
                  {
                    key: '0',
                    name: '团长',
                    type: 'headCommissionRate',
                    value: editSource.headCommissionRate
                  },
                  {
                    key: '1',
                    name: '社区管理员',
                    type: 'areaCommissionRate',
                    value: editSource.areaCommissionRate
                  },
                  {
                    key: '2',
                    name: '合伙人',
                    type: 'cityCommissionRate',
                    value: editSource.cityCommissionRate
                  },
                  {
                    key: '3',
                    name: '管理员',
                    type: 'managerCommissionRate',
                    value: editSource.managerCommissionRate
                  },
                ] : [],
                rules: [
                  {
                    required: true,
                    message: '请输入层级分佣比且所有层级相加为100',
                  },
                ],
              })(
                <EditableTable ></EditableTable>
              )
            }
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('remark', {
              initialValue: editSource.remark,
            })(<TextArea rows={4} placeholder="备注" />)}
          </FormItem>
          <FormItem wrapperCol={{ offset: 9 }}>
            <Button type="primary" onClick={this.handleSave} loading={this.state.loading}>保存</Button>
            <Button style={{marginLeft: '20px'}} onClick={() => onCancel()} loading={this.state.loading}>取消</Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}




export default Form.create()(Add);
