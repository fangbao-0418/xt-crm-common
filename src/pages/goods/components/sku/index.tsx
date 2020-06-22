import React from 'react'
import { Card, Popover, Input, Button, message } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { FormComponentProps } from 'antd/lib/form'
import CardTitle from '../CardTitle'
import SkuUploadItem from './SkuUploadItem'
import styles from './style.module.scss'
import { size, map } from 'lodash'
import { Subtr, accMul, accDiv } from '@/util/utils'
import SkuTable from './SkuTable'

const defaultItem: SkuSaleProps = {
  imageUrl1: '',
  skuCode: '',
  stock: 0,
  areaMemberPrice: undefined,
  cityMemberPrice: undefined,
  costPrice: undefined,
  headPrice: undefined,
  deliveryMode: 1,
  marketPrice: undefined,
  salePrice: undefined,
  managerMemberPrice: undefined,
  expandable: true,
  storeProductSkuId: undefined,
  barCode: undefined,
  unit: undefined,
  incStock: undefined,
  stockAlert: undefined,
  usableStock: 0
}

/** 子规格字段集合 */
const subSpecFields: Array<keyof SkuSaleProps> = ['propertyValue1', 'propertyValue2']

export interface SkuSaleProps {
  /** 供应商id */
  storeProductSkuId?: number
  /** 商品编码 */
  skuCode: string
  /** 发货方式 1-仓库发货, 2-供货商发货, 3-其他, 4-保宏保税仓 */
  deliveryMode: 1 | 2 | 3 | 4
  /** 成本价 */
  costPrice?: number
  /** 市场价 */
  marketPrice?: number
  /** 销售价 */
  salePrice?: number
  /** 团长价 */
  headPrice?: number
  /** 社区管理员价 */
  areaMemberPrice?: number
  /** 城市合伙人价 */
  cityMemberPrice?: number
  /** 公司管理员价 */
  managerMemberPrice?: number
  /** 库存 */
  stock: number
  /** 警戒库存 */
  stockAlert?: number
  propertyValue1?: any
  propertyValue2?: any
  imageUrl1?: string
  [field: string]: any
}

interface Props extends FormComponentProps {
  isGroup?: boolean,
  specs: Spec[]
  dataSource: SkuSaleProps[]
  showImage: boolean
  onChange?: (value: SkuSaleProps[], specs: Spec[], showImage: boolean) => void
  strategyData?: {}
  /** 0-普通商品，10-一般海淘商品，20-保税仓海淘商品 */
  type?: 0 | 10 | 20
  /** sku备案信息 */
  productCustomsDetailVOList: any[]
}
interface SpecItem {
  specName: string;
  specPicture?: string;
}
interface Spec {
  title: string;
  content: SpecItem[];
}
/**
 * speSelect 规格项
 */
interface State {
  specs: Spec[]
  specPictures: string[]
  speSelect: any[]
  spuName: any[]
  noSyncList: any[]
  GGName: string
  showImage: boolean
  tempSpecInfo: {[key: number]: SpecItem}
  tempSpuName: string
  tempSpuPicture: any[]
  /** 添加规格名propover显示状态 */
  dimensionNamePropoverStatus: boolean
  dataSource: SkuSaleProps[]
  strategyData: any
}
class SkuList extends React.Component<Props, State> {
  public state: State = {
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
    dataSource: this.props.dataSource,
    strategyData: {}
  }
  /** 是否发生一级规格项变动 */
  public dirty = false
  public skuTable: any
  public componentWillReceiveProps (props: Props) {
    // console.log('dataSource =>', props.dataSource);
    this.setState({
      showImage: props.showImage,
      specs: props.specs,
      dataSource: props.dataSource,
      strategyData: props.strategyData
    })
  }
  public getCombineResult (specs: Spec[], dataSource: SkuSaleProps[]) {
    const collection = specs.map((item) => item.content)
    const combineResutle: SpecItem[][] = APP.fn.mutilCollectionCombine.apply(null, collection)
    /** 如果合并后只有一组数据切第一项全部都是undefind则数组返回空, */
    if (combineResutle.length === 1 && combineResutle[0].every((item) => item === undefined)) {
      return []
    }
    // let addNew = false
    /** 多规格合并 */
    const result = combineResutle.map((item) => {
      let val: SkuSaleProps = { ...defaultItem }
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
      val.deliveryMode = this.props.type === 20 ? 4 : val.deliveryMode
      item.map((item2, index) => {
        const field = subSpecFields[index]
        val[field] = (item2 && item2.specName) as never
        if (index === 0) {
          val.imageUrl1 = item2 && item2.specPicture || val.imageUrl1
        }
        if (this.dirty) {
          val.skuId = undefined
          val.productBasics = undefined
          val = {
            ...val,
            ...defaultItem,
            imageUrl1: val.imageUrl1
          }
          console.log(val, '------')
        }
      })
      return val
    })
    return result
  }
  handleChangeValue = (text: string, record: any, index: any) => (e: any) => {
    const { dataSource, noSyncList } = this.state
    const nosync = noSyncList.includes(text)
    /**
     * 每个输入框改变
     */
    if (!nosync) {
      dataSource[index][text] = e.target ? e.target.value : e
    } else {
      /* 同步修改一列的数值 */
      dataSource.forEach((item, inex) => {
        item[text] = e.target ? e.target.value : e
      })
    }
    this.setState({ dataSource })
  }
  /* 添加规格不能超过两个 */
  public handleAdd = (title: string) => {
    if (size(this.state.specs) >= 0 && size(this.state.specs) < 2) {
      this.state.specs.push({
        title,
        content: []
      })
      this.setState({
        specs: this.state.specs,
        GGName: ''
      })
    }
  };
  /**
   * 添加子规格
   */
  addSubSpec = (key: number) => () => {
    const specs = this.state.specs
    const { content } = specs[key]
    const { tempSpecInfo, showImage } = this.state
    const specName = (tempSpecInfo[key] && tempSpecInfo[key].specName || '').trim()
    const specPicture = tempSpecInfo[0] && tempSpecInfo[0].specPicture
    if (!specName) {
      message.error('请设置规格名称')
      return
    }
    if (content.find((v) => v.specName === specName)) {
      message.error('请不要填写相同的规格')
      return
    }
    if (content.length === 0) {
      /** 添加第一个子规格时，代表sku重新洗牌skuid传undefind @getCombineResult */
      this.dirty = true
      this.skuTable.clearSelected()
    } else {
      this.dirty = false
    }
    specs[key].content.push(this.state.tempSpecInfo[key])
    tempSpecInfo[key] = {
      specName: '',
      specPicture: ''
    }

    //////////////////////////////
    const dataSource1 = this.getCombineResult(specs, this.state.dataSource)
    console.log(dataSource1, 'dataSource1')
    this.setState({
      dataSource: dataSource1,
      tempSpecInfo,
      specs
    })
    this.onChange(dataSource1)
  };
  handleTabsAdd = () => {
    const GGName = this.state.GGName
    if (!GGName) {
      message.error('请输入正确的规格名称')
      return false
    }
    if (GGName.length > 5) {
      message.error('规格名称不能大于5个字符')
      return
    }
    if (this.state.specs.find((item) => item.title === GGName)) {
      message.error('规格名称重复')
      return false
    }
    this.setState({
      dimensionNamePropoverStatus: false
    })
    this.handleAdd(GGName)
  }

  // 计算价格
  calculatePrice = () => {
    const { dataSource, strategyData } = this.state
    let isZero = false
    let isError = false
    let fields: any = []
    // accAdd, Subtr, accMul, accDiv
    const { categoryProfitRate, headCommissionRate, areaCommissionRate, cityCommissionRate, managerCommissionRate } = strategyData
    const newData = dataSource.map((res, index) => {
      isZero = false
      const { salePrice, costPrice } = res
      if (!Number(salePrice) || !Number(costPrice) || Number(salePrice) - Number(costPrice) < 0) {
        isZero = true
        isError = true
      }
      const grossProfit = Subtr(salePrice, costPrice)//毛利润
      const netProfit : any = Subtr(grossProfit, accDiv(accMul(grossProfit, categoryProfitRate), 100))//去除类目利润比的利润

      const headNetProfit = accDiv(accMul(netProfit, headCommissionRate), 100)
      const areaNetProfit = accDiv(accMul(netProfit, areaCommissionRate), 100)
      const cityNetProfit = accDiv(accMul(netProfit, cityCommissionRate), 100)
      const managerNetProfit = accDiv(accMul(netProfit, managerCommissionRate), 100)

      fields = fields.concat([
        `headPrice-${index}`,
        `areaMemberPrice-${index}`,
        `cityMemberPrice-${index}`,
        `managerMemberPrice-${index}`
      ])
      return Object.assign(res, {
        headPrice: isZero ? 0 : Math.floor(Subtr(salePrice, headNetProfit)*10) / 10,
        areaMemberPrice: isZero ? 0 : Math.floor(Subtr(Subtr(salePrice, areaNetProfit), headNetProfit)*10) / 10,
        cityMemberPrice: isZero ? 0 : Math.floor(Subtr(Subtr(Subtr(salePrice, cityNetProfit), areaNetProfit), headNetProfit)*10) / 10,
        managerMemberPrice: isZero ? 0 : Math.floor(Subtr(Subtr(Subtr(Subtr(salePrice, managerNetProfit), cityNetProfit), areaNetProfit), headNetProfit)*10) / 10
      })
    })
    if (isError) {
      message.error('价格错误，不能进行计算，请确认成本价及销售价是否正确')
    }
    console.log('fields =>', fields)
    this.props.form.resetFields(fields)
    this.setState({
      dataSource: newData
    })
  }

  // 重置价格
  resetPrice = () => {
    const { dataSource } = this.state
    const newData = dataSource.map(res => {
      return Object.assign(res, {
        headPrice: 0,
        areaMemberPrice: 0,
        cityMemberPrice: 0,
        managerMemberPrice: 0
      })
    })

    this.setState({
      dataSource: newData
    })
  }
  /** 删除规格 */
  public removeSpec = (index: number) => {
    const { specs } = this.state
    const delContentLen = specs[index].content.length
    specs.splice(index, 1)
    if (delContentLen === 0) {
      this.setState({
        specs
      })
      this.skuTable.clearSelected()
      return
    }
    this.dirty = true
    this.skuTable.clearSelected()
    this.setState({
      specs,
      dataSource: []
    }, () => {
      this.onChange([])
    })
  }
  /** 删除子规格 */
  public removeSubSpec = (key: number, index: number) => () => {
    this.dirty = false
    /** 另一组索引 */
    const otherKey = key === 0 ? 1 : 0
    const keys = ['propertyValue1', 'propertyValue2']
    const { specs } = this.state
    const specName = specs[key].content[index].specName
    specs[key].content.splice(index, 1)
    let dataSource = this.state.dataSource

    /////////////////////
    dataSource = this.getCombineResult(specs, dataSource)
    this.setState({ specs, dataSource })
    this.onChange(dataSource)
    return
    /////////////////////
  }
  public getCustomColumns () {
    const columns: ColumnProps<any>[] = []
    const keys = ['propertyValue1', 'propertyValue2']
    this.state.specs.map((item, index) => {
      if (keys[index]) {
        columns.push({
          width: 100,
          title: item.title,
          dataIndex: keys[index]
        })
      }
    })
    return columns
  }
  public onChange (dataSource: SkuSaleProps[]) {
    if (this.props.onChange) {
      this.props.onChange(dataSource, this.state.specs, this.state.showImage)
    }
  }
  /** 替换图片 */
  public replaceImage (value: SpecItem) {
    const { dataSource, specs } = this.state
    dataSource.map((item) => {
      if (item.propertyValue1 === value.specName) {
        item.imageUrl1 = value.specPicture
      }
    })
    specs[0].content.map((item) => {
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
  render () {
    const type = this.props.type !== undefined ? this.props.type : 0
    return (
      <Card
        title='添加规格项'
        style={{ marginTop: 10 }}
        extra={(
          <Popover
            trigger='click'
            visible={this.state.dimensionNamePropoverStatus}
            content={(
              <div style={{ display: 'flex' }}>
                <Input
                  style={{ width: 150 }}
                  placeholder='请添加规格名称'
                  value={this.state.GGName}
                  onChange={(e) => {
                    this.setState({
                      GGName: (e.target.value || '').trim()
                    })
                  }}
                />
                <Button type='primary' style={{ marginLeft: 5 }} onClick={this.handleTabsAdd}>
                  确定
                </Button>
              </div>
            )}
          >
            {this.state.specs.length < 2 && (
              <span
                className='href'
                onClick={() => {
                  this.setState({ dimensionNamePropoverStatus: true })
                }}
              >
                添加规格
              </span>
            )}
          </Popover>
        )}
      >
        {this.state.specs.map((spec, key) => {
          return (
            <Card
              style={{ marginBottom: 10 }}
              key={key}
              type='inner'
              title={(
                <CardTitle
                  checked={this.state.showImage}
                  title={spec.title}
                  index={key}
                  onChange={(e: any) => {
                    const { dataSource, specs } = this.state
                    const checked = e.target.checked
                    if (!checked) {
                      dataSource.map((item) => {
                        item.imageUrl1 = ''
                      })
                      specs[0].content.map((item) => {
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
              )}
            >
              <div className={styles.spulist}>
                {map(spec.content, (item, index: number) => (
                  <SkuUploadItem
                    value={item}
                    key={`d-${index}`}
                    disabled
                    index={key}
                    showImage={this.state.showImage && key === 0}
                    onChange={(value) => {
                      this.replaceImage(value)
                    }}
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
                {size(spec.content) < 20 && (
                  <SkuUploadItem
                    value={this.state.tempSpecInfo[key]}
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
                      onClick={this.addSubSpec(key)}
                    >
                      添加规格
                    </Button>
                  </SkuUploadItem>
                )}
              </div>
            </Card>
          )
        })}
        {
          this.state.strategyData ? (
            <>
              <Button type='primary' style={{ marginLeft: 5 }} onClick={this.resetPrice}>
                重置价格
              </Button>
              <Button type='primary' style={{ marginLeft: 5 }} onClick={this.calculatePrice}>
                计算价格
              </Button>
            </>
          ) : null
        }
        <SkuTable
          getInstance={(ref) => {
            this.skuTable = ref
          }}
          type={type}
          isGroup={this.props.isGroup || false}
          form={this.props.form}
          productCustomsDetailVOList={this.props.productCustomsDetailVOList}
          dataSource={this.state.dataSource}
          extraColumns={this.getCustomColumns()}
          onChange={(dataSource) => {
            this.onChange(dataSource)
          }}
        />
      </Card>
    )
  }
}

export default SkuList
