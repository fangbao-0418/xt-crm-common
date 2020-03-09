import React, { Component } from 'react';
import { connect } from '@/util/utils';
import { Row, Col, Icon } from 'antd';
import CategorySelect from '@/components/categorySelect';
import ConfigModal from './components/configModal';
import styles from './index.module.scss';

@connect(state => ({
  levelList: state['shop.commission'].levelList
}))
export default class extends Component {

  componentDidMount() {
    this.fetchaData({
      level: 1,
      parentCategoryId: 0
    });
  }

  /** 请求: 获取类目数据 */
  fetchaData = (params) => {
    const { dispatch } = this.props;
    dispatch['shop.commission'].getList(params);
  }

  /** 操作: 通过关键词搜索类目 */
  handleSearch = (name, levelItem) => {
    this.fetchaData({
      name,
      level: levelItem.id,
      parentCategoryId: levelItem.parentId
    });
  }

  /** 操作: 点击类目选项-显示下一级类目 */
  handleItemClick = (innerItem, levelItem) => {
    const { levelList, dispatch } = this.props;
    // 点击最后一级 不需要显示下级
    if (levelItem.id === levelList[levelList.length - 1].id) return

    // 每次点击类目选项, 显示下一级数据的时候, 需要把下一级类目列表重置, 以防止样式保留的问题
    const lessLevelList = levelList.filter(item => item.id > levelItem.id)
    lessLevelList.forEach(lessItem => {
      lessItem.init = false
    });
    dispatch({
      type: 'shop.commission/saveDefault',
      payload: {
        levelList: [...levelList]
      }
    })

    // 请求下一级数据
    this.fetchaData({
      level: levelItem.id + 1,
      parentCategoryId: innerItem.id
    });
  }

  /** 操作: 类目列表选项配置佣金-显示模态框 */
  handleShowCategoryModal = (currentCategory) => {
    const { dispatch } = this.props;
    dispatch['shop.commission'].getDetai({
      id: currentCategory.id
    });
  }

  /** 视图: 类目列表项显示操作 */
  renderActions = (innerItem) => {
    return (
      <div>
        <Icon type="edit" onClick={() => this.handleShowCategoryModal(innerItem)} />
      </div>
    )
  }

  render() {
    const { levelList } = this.props;

    return (
      <div>
        {/* 配置模态框 */}
        <ConfigModal />
        <Row gutter={16}>
          {
            levelList.map(levelItem => {
              if (!levelItem.init) return null;

              return (
                <Col key={levelItem.id} span={8}>
                  {/* 类目列表 */}
                  <CategorySelect
                    data={levelItem.data}
                    onSearch={(value) => this.handleSearch(value, levelItem)}
                    onItemClick={(innerItem) => this.handleItemClick(innerItem, levelItem)}
                    renderDesc={innerItem => 
                      <Row>
                        <Col span={12} style={{ textAlign: 'center' }}>
                          <span className={styles.icon}>代</span>
                          {innerItem.agencyRate}
                        </Col>
                        <Col span={12} style={{ textAlign: 'center' }}>
                          <span className={styles.icon}>公</span>
                          {innerItem.companyRate}
                        </Col>
                      </Row>
                    }
                    renderActions={(innerItem) => this.renderActions(innerItem)}
                  />
                </Col>
              )
            })
          }
        </Row>
      </div>

    )
  }
}
