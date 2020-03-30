import React from 'react';
import { Popover, Input, Card, Button, message } from 'antd';
import CardTitle from '@/pages/goods/components/CardTitle';
import SkuUploadItem from '@/pages/goods/components/sku/SkuUploadItem';
import styles from '@/pages/goods/components/sku/style.module.scss';
import { size, map, isFunction } from 'lodash';
import CSkuTable from './CSkuTable';
import { If } from '@/packages/common/components'
import { ColumnProps } from 'antd/lib/table';
import { FormComponentProps } from 'antd/lib/form';
interface SpecItem {
  specName: string;
  specPicture?: string;
}
export interface Spec {
  title: string;
  content: SpecItem[];
}
export interface CSkuProps {
  // 商品条形码
  barCode: string;
  // 商品编码
  skuCode: string;
  // 市场价格(单位分)
  marketPrice?: number;
  // 成本价(单位分)
  costPrice?: number;
  // 库存
  stock: number;
  // 规格值1
  propertyValue1?: any;
  // 规格值2
  propertyValue2?: any;
  // 规格1对应的展示图片
  imageUrl1?: string;
  [field: string]: any;
}
interface SkuListState {
  showImage: boolean,
  GGName: string;
  visible: boolean;
  specs: Spec[];
  dataSource: CSkuProps[];
  tempSpecInfo: {[key: number]: SpecItem}
}

const defaultItem: CSkuProps = {
  barCode: '',
  skuCode: '',
  marketPrice: undefined,
  costPrice: undefined,
  stock: 0,
  imageUrl1: '',
  unit: ''
}

interface SkuListProps extends FormComponentProps {
  id: number,
  specs: Spec[]
  dataSource: CSkuProps[]
  showImage: boolean
  onChange?: (value: CSkuProps[], specs: Spec[], showImage: boolean) => void
}

/** 子规格字段集合 */
const subSpecFields: Array<keyof CSkuProps> = ['propertyValue1', 'propertyValue2']

class SkuList extends React.Component<SkuListProps, SkuListState> {
  constructor(props: SkuListProps) {
    super(props);
    this.state = {
      GGName: '',
      visible: false,
      showImage: false,
      specs: props.specs,
      dataSource: props.dataSource,
      tempSpecInfo: {}
    }
  }
  static defaultProps = {
    specs: []
  }
  componentWillReceiveProps(nextProps: SkuListProps) {
    this.setState({
      showImage: nextProps.showImage,
      specs: nextProps.specs,
      dataSource: nextProps.dataSource
    })
  }
  handleTabsAdd = () => {
    const { GGName, specs } = this.state
    if (!GGName) {
      message.error('请设置规格名称');
      return false;
    }
    if (GGName.length > 5) {
      message.error('规格名称不能大于5个字符');
      return
    }
    if (specs.find(item => item.title === GGName)) {
      message.error('规格名称重复');
      return false;
    }
    this.setState({
      visible: false
    })
    this.handleAdd(GGName);
  }
  /**
   * 添加规格不能超过两个
   */
  handleAdd = (title: string) => {
    const { specs } = this.state;
    if (size(specs) >= 0 && size(specs) < 2) {
      specs.push({
        title,
        content: []
      });
      this.setState({
        specs,
        GGName: '',
      });
    }
  }
  onChange (dataSource: CSkuProps[]) {
    const { onChange } = this.props;
    const { specs, showImage } = this.state;
    if (isFunction(onChange)) {
      onChange(dataSource, specs, showImage)
    }
  }
  /**
  * 删除规格
  */
  removeSpec = (index: number) => {
    const { specs } = this.state
    specs.splice(index, 1)
    this.setState({
      specs,
      dataSource: []
    }, () => {
      this.onChange([])
    })
  }
  getCombineResult (specs: Spec[], dataSource: CSkuProps[]) {
    console.log(specs, 'specs getCombineResult')
    console.log(dataSource, 'dataSource getCombineResult')
    const collection = specs.map((item) => item.content)
    const combineResutle: SpecItem[][] = APP.fn.mutilCollectionCombine.apply(null, collection)
    console.log(combineResutle, 'combineResutle getCombineResult')
    /** 如果合并后只有一组数据切第一项全部都是undefind则数组返回空, */
    if (combineResutle.length === 1 && combineResutle[0].every((item) => item === undefined)) {
      return []
    }
    // let addNew = false
    /** 多规格合并 */
    const result = combineResutle.map((item) => {
      let val: CSkuProps = { ...defaultItem }
      /** 根据原规格查找规格信息 */
      val = dataSource.find((item2) => {
        /** item 自定义输入规格序列 规格1，2 */
        return item.every((item3, index) => {
          /**
           * item2[subSpecFields[index]] dataSource里的规格名
           * item3 输入的规格名
           * !item2[subSpecFields[index]] 不存在的规格直接过，dataSource必有一个规格名是存在的，对存在的规格进行比对获取已经输入的信息
           */
          return !item3 || !item2[subSpecFields[index]] || item2 && item3 && item3.specName === item2[subSpecFields[index]]
        })
      }) || val
      // val.deliveryMode = this.props.type === 20 ? 4 : val.deliveryMode
      item.map((item2, index) => {
        const field = subSpecFields[index]
        val[field] = (item2 && item2.specName) as never
        if (index === 0) {
          val.imageUrl1 = item2 && item2.specPicture || val.imageUrl1
        }
        // val.skuId = undefined
      })
      return val
    })
    return result
  }
  /** 删除子规格 */
  removeSubSpec = (key: number, index: number) => () => {
    /** 另一组索引 */
    const otherKey = key === 0 ? 1 : 0
    const keys = ['propertyValue1', 'propertyValue2']
    const { specs } = this.state;
    const specName = specs[key].content[index].specName
    specs[key].content.splice(index, 1)
    let dataSource = this.state.dataSource

    /////////////////////
    dataSource = this.getCombineResult(specs, dataSource)
    this.setState({ specs, dataSource: dataSource });
    this.onChange(dataSource)
    return
    /////////////////////
  };
  replaceImage = (value: SpecItem) => {
    const { dataSource, specs } = this.state
    dataSource.forEach((item) => {
      if (item.propertyValue1 === value.specName) {
        item.imageUrl1 = value.specPicture
      }
    })
    specs[0].content.forEach((item) => {
      if (item.specName === value.specName) {
        item.specPicture = value.specPicture
      }
    })
    this.setState({
      dataSource,
      specs
    }, () => {
      this.onChange(dataSource)
    })
  }
   /**
   * 添加子规格
   */
  addSubSpec = (key: number) => () => {
    let specs = this.state.specs
    const { content } = specs[key]
    const { tempSpecInfo, showImage } = this.state
    const specName = (tempSpecInfo[key] && tempSpecInfo[key].specName || '').trim()
    const specPicture = tempSpecInfo[0] && tempSpecInfo[0].specPicture
    if (!specName) {
      message.error('请设置规格名称');
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

    //////////////////////////////
    const dataSource1 = this.getCombineResult(specs, this.state.dataSource)
    this.setState({
      dataSource: dataSource1,
      tempSpecInfo,
      specs
    })
    this.onChange(dataSource1)
  }
  getCustomColumns () {
    const columns: ColumnProps<any>[] = [];
    const keys = ['propertyValue1', 'propertyValue2'];
    this.state.specs.forEach((item, index) => {
      if (keys[index]) {
        columns.push({
          width: 200,
          fixed: 'left',
          title: item.title,
          dataIndex: keys[index]
        }) 
      }
    })
    return columns
  }
  render() {
    const { 
      specs,
      GGName,
      visible,
      showImage,
      tempSpecInfo,
      dataSource
    } = this.state;
    return (
      <Card
        title='规格'
        style={{ marginTop: 10 }}
        extra={(
          <Popover
            trigger='click'
            visible={visible}
            content={
              <div style={{ display: 'flex' }}>
                <Input
                  style={{width: 150}}
                  placeholder='请添加规格名称'
                  value={GGName}
                  onChange={e => {
                    this.setState({
                      GGName: (e.target.value || '').trim()
                    });
                  }}
                />
                <Button
                  type='primary'
                  style={{ marginLeft: 5 }}
                  onClick={this.handleTabsAdd}
                >
                  确定
                </Button>
              </div>
            }
          >
            <If condition={specs.length < 2}>
              <span
                className='href'
                onClick={() => {
                  this.setState({visible: true})
                }}
              >
                添加规格
              </span>
            </If>
          </Popover>
        )}
      >
        {specs.map((spec, key) => {
          return (
            <Card
              style={{ marginBottom: 10 }}
              key={key}
              type='inner'
              title={(
                <CardTitle
                  checked={showImage}
                  title={spec.title}
                  index={key}
                  onChange={(e: any) => {
                    const { dataSource, specs } = this.state
                    const checked = e.target.checked 
                    if (!checked) {
                      dataSource.forEach((item) => {
                        item.imageUrl1 = ''
                      })
                      specs[0].content.forEach((item) => {
                        item.specPicture = ''
                      })
                    }
                    this.setState({
                      showImage: checked,
                      dataSource,
                      specs
                    }, () => {
                      this.onChange(dataSource)
                    })
                  }}
                />
              )}
              extra={(
                <span
                  className='href'
                  onClick={() => {
                    this.removeSpec(key)
                  }}
                >
                  删除
                </span>
              )}>
              <div className={styles.spulist}>
                {map(spec.content, (item, index: number) => (
                  <SkuUploadItem
                    value={item}
                    key={`d-${index}`}
                    disabled
                    index={key}
                    showImage={this.state.showImage && key === 0}
                    onChange={this.replaceImage}
                  >
                    <Button
                      className={styles.spubtn}
                      type='danger'
                      onClick={this.removeSubSpec(key, index)}
                    >
                      删除规格
                    </Button>
                  </SkuUploadItem>
                ))}
                {size(spec.content) < 10 && (
                  <SkuUploadItem
                    value={tempSpecInfo[key]}
                    showImage={this.state.showImage && key === 0}
                    onChange={(value) => {
                      const tempSpecInfo = this.state.tempSpecInfo
                      tempSpecInfo[key] = value
                      this.setState({
                        tempSpecInfo
                      })
                    }}
                  >
                    <Button
                      className={styles.spubtn}
                      type='primary'
                      onClick={this.addSubSpec(key)}>
                      添加规格
                    </Button>
                  </SkuUploadItem>
                )}
              </div>
            </Card>
          )
        })}
        <CSkuTable
          id={this.props.id}
          form={this.props.form}
          dataSource={dataSource || []}
          extraColumns={this.getCustomColumns()}
          onChange={(dataSource) => {
            this.onChange(dataSource)
          }}
        />
      </Card>
    );
  }
}

export default SkuList;
