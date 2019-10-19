import React, { Component, PureComponent, useState, useEffect } from 'react';
import { Modal, Checkbox, Icon, Popover } from 'antd';
import PropTypes from 'prop-types';
import * as api from './api';
import { isEqual, omitBy, isNil, filter, cloneDeep } from 'lodash';
import { isThisYear } from 'date-fns';

const CheckboxGroup = Checkbox.Group;

/**
 * 省组件
 */
const Group = props => {
  const {
    source,
    checkedSource: { children = [] },
  } = props;
  const [status, setStatus] = useState(false);
  const [indeterminate, setIndeterminate] = useState(
    !!children.length && children.length < source.children.length,
  );
  const [checkAll, setCheckAll] = useState(children.length === source.children.length);
  const [checkedList, setCheckedList] = useState(children);

  const onCheckAllChange = e => {
    const { checked } = e.target;
    setIndeterminate(false);
    setCheckAll(checked);
    setCheckedList(checked ? source.children : []);
  };

  const childrenChange = checkedList => {
    setIndeterminate(!!checkedList.length && checkedList.length < source.children.length);
    setCheckAll(checkedList.length === source.children.length);
    setCheckedList(
      source.children.filter(item => {
        return checkedList.includes(item.id);
      }),
    );
  };

  useEffect(() => {
    if (status) {
      props.changeChecked(
        omitBy(
          {
            ...source,
            children: checkedList,
          },
          isNil,
        ),
      );
    } else {
      setStatus(true);
    }
  }, [checkedList]);

  return (
    <span style={{ display: 'inline-block', width: 190, paddingTop: '20px' }}>
      <Popover
        placement="bottom"
        content={
          <CheckboxGroup value={checkedList.map(item => item.id)} onChange={childrenChange}>
            <CityGroup source={source.children} />
          </CheckboxGroup>
        }
        getPopupContainer={() => document.getElementById('cascader-city')}
      >
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          <span>
            {source.name}
            <a>({checkedList.length})</a>
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
            <Checkbox value={item.id}>{item.name}</Checkbox>
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
  };

  constructor(props) {
    super(props);
    this.state = {
      sourceData: [],
      checkedSourceData: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value) {
      return {
        checkedSourceData: cloneDeep(nextProps.value),
      };
    }
    return null;
  }

  componentDidMount() {
    api.getProvinces().then(result => {
      this.setState({
        sourceData: result,
      });
    });
  }
  render() {
    const { visible, ...props } = this.props;
    const { sourceData, checkedSourceData } = this.state;
    return (
      <>
        {visible ? (
          <Modal {...props} visible={true} width={700} onOk={this.onOk}>
            <div id="cascader-city" style={{ padding: '0 30px', overflow: 'hidden' }}>
              {sourceData.map(item => {
                const checkedItem = checkedSourceData.find(
                  checkedItem => checkedItem.id === item.id,
                );
                return (
                  <Group
                    key={item.id}
                    source={item}
                    checkedSource={checkedItem || {}}
                    changeChecked={this.changeChecked}
                  />
                );
              })}
            </div>
          </Modal>
        ) : null}
      </>
    );
  }

  changeChecked = checkedData => {
    const { checkedSourceData } = this.state;
    const existItem = checkedSourceData.find(item => item.id === checkedData.id);
    if (existItem) {
      existItem.children = checkedData.children;
      this.setState(
        {
          checkedSourceData,
        },
        () => {
          const { checkedSourceData } = this.state;
          this.props.onChange(cloneDeep(checkedSourceData));
        },
      );
    } else {
      this.setState(
        {
          checkedSourceData: [...checkedSourceData, checkedData],
        },
        () => {
          const { checkedSourceData } = this.state;
          this.props.onChange(cloneDeep(checkedSourceData));
        },
      );
    }
  };

  onOk = () => {
    const { checkedSourceData } = this.state;
    this.setState({
      checkedSourceData: [],
    }, () => {
      this.props.onOk(filter(checkedSourceData, item => item.children.length));
    })
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
