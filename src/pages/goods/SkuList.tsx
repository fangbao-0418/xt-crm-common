import React from 'react';
import { Table, Card, Popover, Input, Button, message } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getColumns } from './constant';
import CardTitle from './CardTitle';
import SkuUploadItem from './SkuUploadItem';
import descartes from '../../util/descartes';
import styles from './edit.module.scss';
import { size, map, concat } from 'lodash';

interface SkuProps {
  /** 商品编码 */
  skuCode: string
  /** 发货方式 1-仓库发货, 2-供货商发货, 3-其他 */
  deliveryMode: 1 | 2 | 3
  /** 成本价 */
  costPrice: number
  /** 市场价 */
  marketPrice: number
  /** 销售价 */
  salePrice: number
  /** 团长价 */
  headPrice: number
  /** 社区管理员价 */
  areaMemberPrice: number
  /** 城市合伙人价 */
  cityMemberPrice: number
  /** 公司管理员价 */
  managerMemberPrice: number
  /** 库存 */
  stock: number
  /** 警戒库存 */
  stockAlert?: number
  propertyValue1?: any
  propertyValue2?: any
  imageUrl1?: string
  [field: string]: any
}

interface Props {
  specs: Spec[]
  dataSource: SkuProps[]
  onChange?: (value: SkuProps[]) => void
}
interface SpecItem {
  specName: string;
  specPicture?: string;
}
interface Spec {
  title: string;
  content: SpecItem[];
}
interface TempSpecInfoItem {
  tempSpuName: string;
  tempSpuPicture: any[];
}
/**
 * speSelect 规格项
 */
interface State {
  specs: Spec[];
  specPictures: string[];
  speSelect: any[];
  spuName: any[];
  noSyncList: any[];
  GGName: string;
  showImage: boolean;
  tempSpecInfo: {[key: number]: SpecItem}
  tempSpuName: string;
  tempSpuPicture: any[];
  /** 添加规格名propover显示状态 */
  dimensionNamePropoverStatus: boolean
  dataSource: SkuProps[]
}
class SkuList extends React.Component<Props, State>{
  state: State = {
    specs: this.props.specs,
    specPictures: [],
    speSelect: [],
    spuName: [],
    noSyncList: [],
    GGName: '',
    showImage: false,
    tempSpecInfo: {},
    tempSpuName: '',
    tempSpuPicture: [],
    dimensionNamePropoverStatus: false,
    dataSource: this.props.dataSource
  }
  public componentWillReceiveProps (props: Props) {
    let showImage = false
    if (props.specs[0]) {
      showImage = props.specs[0].content.findIndex(item => !!item.specPicture) > -1
    }
    console.log(props.specs, showImage, 'showImage')
    this.setState({
      showImage,
      specs: props.specs,
      dataSource: props.dataSource
    })
  }
  handleChangeValue = (text: string, record: any, index: any) => (e: any) => {
    const { dataSource, noSyncList } = this.state;
    const nosync = noSyncList.includes(text);
    /**
     * 每个输入框改变
     */
    if (!nosync) {
      dataSource[index][text] = e.target ? e.target.value : e;
    }
    /**
     * 同步修改一列的数值
     */
    else {
      dataSource.forEach((item, inex) => {
        item[text] = e.target ? e.target.value : e
      })
    }
    this.setState({ dataSource });
  };
  /**
   * 添加规格不能超过两个
   */
  handleAdd = (title: string) => {
    if (size(this.state.specs) >= 0 && size(this.state.specs) < 2) {
      this.state.specs.push({
        title,
        content: []
      });
      this.setState({
        specs: this.state.specs,
        GGName: '',
      });
    }
  };
  /**
   * 添加规格高阶函数
   */
  widthAddSpecCb = (key: number) => () => {
    let specs = this.state.specs
    const { content } = specs[key]
    const { tempSpecInfo, showImage } = this.state
    const specName = tempSpecInfo[key] && tempSpecInfo[key].specName
    const specPicture = tempSpecInfo[key] && tempSpecInfo[key].specPicture
    if (!specName) {
      message.error('请设置规格名称');
      return
    }
    if (showImage && !specPicture && key === 0) {
      message.error('请设置规格商品图');
      return
    }
    if (content.find((v) => v.specName === specName)) {
      message.error('请不要填写相同的规格');
      return
    }
    specs[key].content.push(this.state.tempSpecInfo[key])
    tempSpecInfo[key] = {
      specName: '',
      specPicture: ''
    }
    const addData: SkuProps[] = []
    const defaultItem: SkuProps = {
      skuCode: '',
      stock: 0,
      areaMemberPrice: 0,
      cityMemberPrice: 0,
      costPrice: 0,
      headPrice: 0,
      deliveryMode: 1,
      marketPrice: 0,
      salePrice: 0,
      managerMemberPrice: 0
    }
    let dataSource = this.state.dataSource
    if (key === 0) {
      if (!specs[1] || specs[1] && specs[1].content.length <= 1) {
        addData.push({
          ...defaultItem,
          propertyValue1: specName,
          propertyValue2: specs[1] && specs[1].content[0] && specs[1].content[0].specName
        })
      } else if (specs[1] && specs[1].content.length > 1) {
        specs[1] && specs[1].content.map((item) => {
          addData.push({
            ...defaultItem,
            propertyValue1: specName,
            propertyValue2: item.specName
          })
        })
      }
    } else {
      if (!specs[0] || specs[0] && specs[0].content.length === 0) {
        addData.push({
          ...defaultItem,
          propertyValue1: '',
          propertyValue2: specName
        })
      } else if (specs[0] && specs[0].content.length >= 1 && specs[1].content.length === 1 && dataSource.length > 0) {
        dataSource = dataSource.map((item) => {
          item.propertyValue2 = specName
          return item
        })
      } else {
        specs[0] && specs[0].content.map((item) => {
          addData.push({
            ...defaultItem,
            propertyValue1: item.specName ,
            propertyValue2: specName
          })
        })
      }
    }
    dataSource = dataSource.concat(addData)
    this.setState({
      dataSource,
      tempSpecInfo,
      specs
    })
    this.onChange(dataSource)
  };
  handleTabsAdd = () => {
    const { GGName } = this.state;
    if (!GGName) {
      message.error('请输入正确的规格名称');
      return false;
    }
    this.setState({
      dimensionNamePropoverStatus: false
    })
    this.handleAdd(GGName);
  };
  /**
  * 删除规格
  */
  handleRemoveSpec = (index: number) => {
    const { specs } = this.state
    specs.splice(index, 1)
    this.setState({
      specs,
      dataSource: []
    })
  };

  removeSpecWithCb = (key: number, index: number) => () => {
    /** 另一组索引 */
    const otherKey = key === 0 ? 1 : 0
    const keys = ['propertyValue1', 'propertyValue2']
    const { specs } = this.state;
    const specName = specs[key].content[index].specName
    specs[key].content.splice(index, 1)
    let dataSource = this.state.dataSource
    if (specs[key].content.length > 0) {
      dataSource = dataSource.filter((item) => {
        return item[keys[key]] !== specName
      })
    } else {
      dataSource = dataSource.map((item) => {
        item[keys[0]] = item[keys[otherKey]]
        item[keys[1]] = ''
        return item
      })
    }
    /** 是否存在规格商品 */
    let isExistSpec = false
    specs.map((item) => {
      item.content.map((val) => {
        isExistSpec = true
      })
    })
    if (!isExistSpec || specs[key].content.length === 0) {
      dataSource = []
    }
    console.log(dataSource, 'remove')
    this.setState({ specs, dataSource: dataSource });
    this.onChange(dataSource)
  };
  /**
   * 每个规格临时名称
   */
  // withChangeSpuNameCb = (key: number) => (spuName: string) => {
  //   const { tempSpecInfo } = this.state;
  //   if (tempSpecInfo[key]) {
  //     tempSpecInfo[key].tempSpuName = spuName;
  //   }
  //   this.setState({
  //     tempSpecInfo
  //   })
  // };
  /**
   * 每个规格临时图片
   */
  // withChangeSpuPictureCb = (key: number) => (spuPicture: any[]) => {
  //   const { tempSpecInfo } = this.state;
  //   if (tempSpecInfo[key]) {
  //     tempSpecInfo[key].tempSpuPicture = spuPicture;
  //   }
  //   this.setState({ tempSpecInfo })
  // }
  public getCustomColumns () {
    const columns: ColumnProps<any>[] = []
    const keys = ['propertyValue1', 'propertyValue2']
    this.state.specs.map((item, index) => {
      if (keys[index]) {
        columns.push({
          title: item.title,
          dataIndex: keys[index]
        }) 
      }
    })
    
    return columns
  }
  public onChange (dataSource: SkuProps[]) {
    if (this.props.onChange) {
      this.props.onChange(dataSource)
    }
  }
  render() {
    return (
      <Card
        title="添加规格项"
        style={{ marginTop: 10 }}
        extra={
          <Popover
            trigger="click"
            visible={this.state.dimensionNamePropoverStatus}
            content={
              <div style={{ display: 'flex' }}>
                <Input
                  placeholder="请添加规格名称"
                  value={this.state.GGName}
                  onChange={e => {
                    this.setState({
                      GGName: e.target.value
                    });
                  }}
                />
                <Button type="primary" style={{ marginLeft: 5 }} onClick={this.handleTabsAdd}>
                  确定
                </Button>
              </div>
            }
          >
            {this.state.specs.length < 2 && (
              <span
                className='href'
                onClick={() => {
                  this.setState({dimensionNamePropoverStatus: true})
                }}
              >
                添加规格
              </span>
            )}
          </Popover>
        }
      >
        {this.state.specs.map((spec, key) => {
          return (
            <Card
              key={key}
              type="inner"
              title={(
                <CardTitle
                  checked={this.state.showImage}
                  title={spec.title}
                  index={key}
                  onChange={(e: any) => {
                    this.setState({ showImage: e.target.checked })
                  }}
                />
              )}
              extra={
                <a href="javascript:void(0);" onClick={() => this.handleRemoveSpec(key)}>删除</a>
              }>
              <div className={styles.spulist}>
                {map(spec.content, (item, index: number) => (
                  <SkuUploadItem
                    value={item}
                    key={`d-${index}`}
                    disabled
                    index={key}
                    showImage={this.state.showImage && key === 0}
                  >
                    <Button
                      className={styles.spubtn}
                      type="danger"
                      onClick={this.removeSpecWithCb(key, index)}
                    >
                      删除规格
                    </Button>
                  </SkuUploadItem>
                ))}
                {size(spec.content) < 10 && (
                  <SkuUploadItem
                    value={this.state.tempSpecInfo[key]}
                    showImage={this.state.showImage && key === 0}
                    onChange={(value) => {
                      console.log(value, 'xxxxxxxxxxx')
                      const tempSpecInfo = this.state.tempSpecInfo
                      tempSpecInfo[key] = value
                      this.setState({
                        tempSpecInfo
                      })
                    }}
                  >
                    <Button
                      className={styles.spubtn}
                      type="primary"
                      onClick={this.widthAddSpecCb(key)}>
                      添加规格
                    </Button>
                  </SkuUploadItem>
                )}
              </div>
            </Card>
          )
        })}
        <Table
          rowKey={(record: any) => record.id}
          style={{ marginTop: 10 }}
          scroll={{ x: 1650, y: 600 }}
          columns={[
            ...this.getCustomColumns(),
            ...getColumns(this.handleChangeValue)
          ]}
          dataSource={this.state.dataSource}
          pagination={false}
        />
      </Card>
    )
  }
}

export default SkuList;