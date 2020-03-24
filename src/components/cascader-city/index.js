import React, { Component, PureComponent, useState, useEffect } from 'react';
import { Modal, Checkbox, Icon, Popover } from 'antd';
import PropTypes from 'prop-types';
import * as api from './api';
import { filter, cloneDeep } from 'lodash';

const CheckboxGroup = Checkbox.Group;

/**
 * 省组件
 */
const Group = props => {
  const {
    source,
    checkedSource: { children = [] },
  } = props;

  const [indeterminate, setIndeterminate] = useState(
    !!children.length && children.length < source.children.length,
  );
  /** 省的选中状态 */
  const [checkAll, setCheckAll] = useState(children.length === source.children.length);
  /** 选中省对应的市区列表 */
  const [checkedList, setCheckedList] = useState(children);
  
  /**
   * 修改对应省组件市区列表
   */
  const changeChildren = (children) => {
    if (props.onChange) {
      console.log(props, 'onCheckAllChange')
      /** 改变children的内容 */
      props.onChange({
        ...props.source,
        children
      })
    }
  }
  /**
   * 省选择框改变触发回调
   * @param {*} e 
   */
  const onCheckAllChange = e => {
    const { checked } = e.target;
    /**  Indeterminate置为false，要么选中要么选不中 */
    setIndeterminate(false);
    /** 设置对应选中状态 */
    setCheckAll(checked);
    /** 选中即全选市区列表，选不中即市区列表状态全部置为false */
    setCheckedList(checked ? source.children : []);
    changeChildren(checked ? source.children : [])
  };

  /**
   * 选中省对应市区列表变化执行相应回调
   * @param {*} checkedList 
   */
  const childrenChange = checkedList => {
    console.log('checkedList=>', checkedList)
    // 选中省对应市区列表长度不为0且不全选设置Indeterminate状态
    setIndeterminate(!!checkedList.length && checkedList.length < source.children.length);
    // 选中省对应市区列表长度等于省对应市区列表长度，即为全选状态
    setCheckAll(checkedList.length === source.children.length);
    // 设置省对应市区列表
    const checkedChilden = source.children.filter(item => {
      return checkedList.includes(item.id);
    })
  
    setCheckedList(checkedChilden);
    changeChildren(checkedChilden)
  };

  /**
   * 选中省数据变化执行什么周期钩子函数
   */
  useEffect(() => {
    // console.log(props.source.name, children.length, source.children.length)
    // console.log(!!children.length, children.length < source.children.length)
    setIndeterminate(!!children.length && (children.length < source.children.length))
    setCheckAll(children.length === source.children.length);
    setCheckedList(children)
  }, [props.checkedSource]);

  return (
    <span style={{ display: 'inline-block', width: 190, paddingTop: '20px' }}>
      <Popover
        placement="bottom"
        content={
          <CheckboxGroup value={checkedList.map(item => item.id)} onChange={childrenChange}>
            <CityGroup disabled={props.disabled} source={source.children} />
          </CheckboxGroup>
        }
        getPopupContainer={() => document.getElementById('cascader-city')}
      >
        <Checkbox disabled={props.disabled} indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          <span>
            {source.name}
            <span className="href">({checkedList.length})</span>
          </span>
          <Icon type="down" />
        </Checkbox>
      </Popover>
    </span>
  );
};

/**
 * 市组件
 */
const CityGroup = props => {
  const { source } = props;
  return (
    <div style={{ maxHeight: 210, overflow: 'auto' }}>
      {source.map(item => {
        return (
          <div key={item.id}>
            <Checkbox disabled={props.disabled} value={item.id}>{item.name}</Checkbox>
          </div>
        );
      })}
    </div>
  );
};

class CascaderCity extends (PureComponent || Component) {
  static defaultProps = {
    title: '选择区域',
    visible: false,
    onChange: checkedResult => {},
    onOk: () => {},
    onCancel: () => {},
    disabled: false
  };

  constructor(props) {
    super(props);
    this.state = {
      sourceData: [],
      checkedSourceData: [],
    };
  }
  /**
   * 获取数据源 
   */
  componentDidMount() {
    api.getProvinces().then(result => {
      this.setState({
        sourceData: result,
      });
    });
  }
  /**
   * 组件接受数据改变选中项
   * @param {*} props 
   */
  componentWillReceiveProps (props) {
    this.setState({
      checkedSourceData: cloneDeep(props.value),
    })
  }
  render() {
    const { sourceData, checkedSourceData } = this.state;
    // console.log(this.props.value, checkedSourceData, 'render')
    return (
      <Modal
        {...this.props}
        width={700}
        onOk={this.onOk}
        okButtonProps={{ disabled: this.props.disabled }}
      >
        <div id="cascader-city" style={{ padding: '0 30px', overflow: 'hidden' }}>
          {sourceData.map(item => {
            /** 遍历找出所有选中项 */
            const checkedItem = (checkedSourceData || []).find(checkedItem => checkedItem.id === item.id);
            return (
              <Group
                disabled={this.props.disabled}
                key={item.id}
                source={item}
                checkedSource={checkedItem || {}}
                onChange={this.changeChecked}
              />
            );
          })}
        </div>
      </Modal>
    );
  }

  changeChecked = checkedData => {
    // console.log(checkedData, 'checkedData')
    let { checkedSourceData } = this.state;
    const index = checkedSourceData.findIndex(item => item.id === checkedData.id);
    if (index !== -1) {
      checkedSourceData[index].children = checkedData.children;
      this.setState(
        {
          checkedSourceData,
        }
      );
    } else {
      checkedSourceData =  [...checkedSourceData, checkedData]
      this.setState(
        {
          checkedSourceData
        }
      )
    }
    this.onChange(checkedSourceData)
  };
  onChange (checkedSourceData) {
    console.log(checkedSourceData, 'on change xxxxxxxx')
    if (this.props.onChange) {
      this.props.onChange(cloneDeep(checkedSourceData));
    }
  }
  onOk = () => {
    const { checkedSourceData } = this.state;
    this.setState(
      {
        checkedSourceData: [],
      },
      () => {
        console.log('checkedSourceData=>', checkedSourceData)
        this.props.onOk(filter(checkedSourceData, item => item.children.length));
      },
    );
  };

  onCancel = () => {
    this.props.onCancel();
  };
}

CascaderCity.propTypes = {
  // 标题
  title: PropTypes.string,
  // 显示状态
  visible: PropTypes.bool,
  // 默认选中数据
  defaultValue: PropTypes.array,
  // 选中数据
  value: PropTypes.array,
  //组件值更改
  onChange: PropTypes.func,
  // 确定事件
  onOk: PropTypes.func,
  // 取消事件
  onCancel: PropTypes.func,
};

export default CascaderCity;
