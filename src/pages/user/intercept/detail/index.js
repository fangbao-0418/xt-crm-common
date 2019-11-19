import React, { Component, useState } from 'react';
import {
  Switch,
  Card,
  Divider,
  Tabs,
  message,
  Modal,
  Input,
  Select,
  Form,
  Spin,
  Button
} from 'antd';
import styles from './index.module.sass';
import Stock from './stock';
import Order from '@/pages/order/order-table';
import Refund from '@/pages/order/refund/list';
import {
  getPrivilegeById,
  openPrivilege,
  closePrivilege,
  getAddressByMemberId,
  getBaseAddress,
  updateAddressByMemberId,
  addAddressByMemberId
} from './api';
import { parseQuery } from '@/util/utils';
import { isNil } from 'lodash';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const CascaderByArea = ({ value, onChange, baseAddress }) => {
  const { currentProvince: province, currentCity: city, currentDistrict: district } = value || {};
  const [currentProvince, useCurrentProvince] = useState({});
  const [currentCity, useCurrentCity] = useState({});
  const [currentDistrict, useCurrenDistrict] = useState({});
  const [first, useFirst] = useState(true);

  if (province && city && district && baseAddress.length && first) {
    useCurrentProvince(province || {});
    useCurrentCity(city || {});
    useCurrenDistrict(district || {});
    useFirst(false);
  }

  const changeProvince = value => {
    const currentProvince = baseAddress.find(item => item.id == value) || {};
    useCurrentProvince(currentProvince);
    useCurrentCity({});
    useCurrenDistrict({});
    onChange();
  };

  const changeCity = value => {
    const currentCity = (currentProvince.children || []).find(item => item.id == value);
    useCurrentCity(currentCity);
    useCurrenDistrict({});
    onChange();
  };

  const changeDistrict = value => {
    const currentDistrict = (currentCity.children || []).find(item => item.id == value);
    useCurrenDistrict(currentDistrict);
    onChange({
      currentProvince,
      currentCity,
      currentDistrict
    });
  };

  return (
    <div>
      <Select
        value={currentProvince.id}
        placeholder="选择省"
        style={{ width: 130 }}
        onChange={changeProvince}
      >
        {(baseAddress || []).map(province => (
          <Option key={province.id}>{province.name}</Option>
        ))}
      </Select>
      <Select
        value={currentCity.id}
        placeholder="选择市"
        style={{ width: 120, marginLeft: 8 }}
        onChange={changeCity}
      >
        {(currentProvince.children || []).map(city => (
          <Option key={city.id}>{city.name}</Option>
        ))}
      </Select>
      <Select
        value={currentDistrict.id}
        placeholder="选择区"
        style={{ width: 120, marginLeft: 8 }}
        onChange={changeDistrict}
      >
        {(currentCity.children || []).map(district => (
          <Option key={district.id}>{district.name}</Option>
        ))}
      </Select>
    </div>
  );
};

@Form.create()
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * @member 是否有拦截权限
       */
      isPrivilege: false,
      /**
       * @member 售后地址信息
       */
      address: undefined,
      /**
       * 售后地址编辑窗是否可见
       */
      addressVisible: false,
      /**
       * 基础地址库(省市区列表)
       */
      baseAddress: [],
      /**
       * @member 当前省
       */
      currentProvince: undefined,
      /**
       * @member 当前市
       */
      currentCity: undefined,
      /**
       * @member 当前区
       */
      currentDistrict: undefined
    };
  }
  componentDidMount() {
    const obj = parseQuery();
    getPrivilegeById({ id: obj.id }).then(isPrivilege => {
      this.setState({
        isPrivilege
      });
    });
    getAddressByMemberId({ memberId: obj.id }).then(address => {
      this.setState({
        address
      });
    });
  }

  render() {
    const {
      isPrivilege,
      address,
      addressVisible,
      addressLoading,
      baseAddress,
      currentProvince,
      currentCity,
      currentDistrict,
      name,
      phone,
      detailAddress
    } = this.state;
    const {
      form: { getFieldDecorator }
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 20 }
      }
    };
    return (
      <Card>
        <div className={styles['setting']}>
          <span>
            拦截发货权限
            <Switch
              style={{ marginLeft: 8 }}
              checked={isPrivilege}
              onChange={this.privilegeChange}
            />
          </span>
          <span className={styles['address']}>
            <span>售后地址：</span>
            {isNil(address) ? (
              <Button type="link" style={{ padding: 0 }} onClick={this.changeAddress}>
                设置
              </Button>
            ) : (
              <span>
                <span>{`${address.province} ${address.city} ${address.district} ${address.street}`}</span>
                <Button type="link" style={{ padding: 0 }} onClick={this.changeAddress}>
                  修改
                </Button>
              </span>
            )}
          </span>
        </div>
        <Divider />
        <Tabs>
          <TabPane tab="用户库存" key="stock">
            <Stock />
          </TabPane>
          <TabPane tab="拦截订单" key="order">
            <Order type="order" intercept={true} />
          </TabPane>
          <TabPane tab="相关售后" key="after">
            <Refund key="ALL" type="ALL" intercept={true} />
          </TabPane>
        </Tabs>
        <Modal
          title="设置售后地址"
          visible={addressVisible}
          onCancel={this.onCancel}
          onOk={addressLoading ? this.onCancel : this.onOk}
        >
          <Spin spinning={addressLoading}>
            <Form {...formItemLayout}>
              <Form.Item label="姓名">
                {getFieldDecorator('consignee', {
                  rules: [
                    {
                      required: true,
                      message: '请输入姓名'
                    }
                  ],
                  initialValue: name
                })(<Input placeholder="请输入姓名" style={{ width: 200 }} maxLength={20} />)}
              </Form.Item>
              <Form.Item label="手机号">
                {getFieldDecorator('mobilePhone', {
                  rules: [
                    {
                      required: true,
                      message: '请输入手机号'
                    }
                  ],
                  initialValue: phone
                })(<Input placeholder="请输入手机号" style={{ width: 200 }} maxLength={11} />)}
              </Form.Item>
              <Form.Item label="省市区">
                {getFieldDecorator('area', {
                  rules: [
                    {
                      required: true,
                      message: '请选择省市区'
                    }
                  ],
                  initialValue:
                    currentProvince || currentDistrict || currentCity
                      ? { currentProvince, currentDistrict, currentCity }
                      : undefined
                })(<CascaderByArea baseAddress={baseAddress} />)}
              </Form.Item>
              <Form.Item label="详细地址">
                {getFieldDecorator('street', {
                  rules: [
                    {
                      required: true,
                      message: '请输入详细地址'
                    }
                  ],
                  initialValue: detailAddress
                })(<TextArea rows={4} placeholder="请填写详细地址(比如街道、小区、乡镇、村)" />)}
              </Form.Item>
            </Form>
          </Spin>
        </Modal>
      </Card>
    );
  }

  privilegeChange = checked => {
    if (checked) {
      const obj = parseQuery();
      openPrivilege({ id: obj.id }).then(() => {
        this.setState(
          {
            isPrivilege: true
          },
          () => {
            message.success('拦截权限开启成功');
          }
        );
      });
    } else {
      const obj = parseQuery();
      closePrivilege({ id: obj.id }).then(() => {
        this.setState(
          {
            isPrivilege: false
          },
          () => {
            message.success('拦截权限关闭成功');
          }
        );
      });
    }
  };

  changeAddress = () => {
    const { address } = this.state;
    const { consignee, mobilePhone, street } = address || {};
    this.setState(
      {
        name: consignee,
        phone: mobilePhone,
        detailAddress: street,
        addressVisible: true,
        addressLoading: true,
        currentProvince: {},
        currentCity: {},
        currentDistrict: {}
      },
      () => {
        getBaseAddress().then(baseAddress => {
          const { provinceId, cityId, districtId } = address || {};
          const currentProvince = (baseAddress || []).find(item => item.id == provinceId);
          const currentCity = ((currentProvince && currentProvince.children) || []).find(
            item => item.id == cityId
          );
          const currentDistrict = ((currentCity && currentCity.children) || []).find(
            item => item.id == districtId
          );
          this.setState({
            baseAddress,
            currentProvince,
            currentCity,
            currentDistrict,
            addressLoading: false
          });
        });
      }
    );
  };

  changeName = ({ target: { value } }) => {
    this.setState({
      name: value
    });
  };

  changePhone = ({ target: { value } }) => {
    this.setState({
      phone: value
    });
  };

  onCancel = () => {
    const {
      form: { resetFields }
    } = this.props;
    this.setState(
      {
        addressVisible: false,
        currentProvince: {},
        currentCity: {},
        currentDistrict: {}
      },
      () => {
        resetFields();
      }
    );
  };

  onOk = () => {
    const obj = parseQuery();
    const {
      form: { validateFields }
    } = this.props;
    const { address } = this.state;
    validateFields((err, values) => {
      if (!err) {
        const { area, ...otherValue } = values;
        const { currentProvince, currentCity, currentDistrict } = area;
        let payload = {
          ...otherValue,
          provinceId: currentProvince.id,
          province: currentProvince.name,
          cityId: currentCity.id,
          city: currentCity.name,
          districtId: currentDistrict.id,
          district: currentDistrict.name,
          defaultAddress: 1,
          shopOwnerId: obj.id
        };
        if (address) {
          payload.id = address.id;
          updateAddressByMemberId(payload).then(res => {
            if (res) {
              message.success('售后地址更新成功');
              getAddressByMemberId({ memberId: obj.id }).then(address => {
                this.setState({
                  address,
                  addressVisible: false
                });
              });
            }
          });
        } else {
          addAddressByMemberId(payload).then(res => {
            if (res) {
              message.success('售后地址新增成功');
              getAddressByMemberId({ memberId: obj.id }).then(address => {
                this.setState({
                  address,
                  addressVisible: false
                });
              });
            }
          });
        }
      }
    });
  };
}
