import React from 'react';
import { Card, Row, Col, Form, Table, Input, Icon, Tooltip, Button, Checkbox, message, InputNumber, Modal } from 'antd';
import { formatMoneyWithSign } from '@/pages/helper';
import { map, flattenDeep } from 'lodash';
import UploadView from '@/components/upload';
import { setPromotionAddSKu } from '../api';
import Image from '@/components/Image';
import ArrowContain from '@/pages/goods/components/arrow-contain'
import If from '@/packages/common/components/if'
import { Decimal } from 'decimal.js';
const FormItem = Form.Item;
const replaceHttpUrl = imgUrl => {
  return imgUrl.replace('https://assets.hzxituan.com/', '').replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', '');
}
const initImgList = imgUrlWap => {
  if (imgUrlWap) {
    if (imgUrlWap.indexOf('http') !== 0) {
      imgUrlWap = 'https://assets.hzxituan.com/' + imgUrlWap;
    }
    return [
      {
        uid: `${-parseInt(Math.random() * 1000)}`,
        url: imgUrlWap,
        status: 'done',
        thumbUrl: imgUrlWap,
        name: imgUrlWap,
      },
    ];
  }
  return [];
};

function speedyInput (field, text, record, index, dataSource, cb) {
  dataSource = dataSource || []
  return (node) => (
    <ArrowContain
      disabled={dataSource.length <= 1}
      type={((index === 0 && 'down') || (index === dataSource.length - 1 && 'up') || undefined)}
      onClick={(type) => {
        let stock = text
        let current = 0
        let end = index
        if (type === 'down') {
          current = index
          end = dataSource.length - 1
        }
        while (current <= end) {
          const { sellableQty } = dataSource[current]
          if (field === 'inventory') {
            stock = (sellableQty && stock > sellableQty) ? sellableQty : stock
          }
          cb(field, current)(stock)
          current++
        }
      }}
    >
      {node}
    </ArrowContain>
  )
}

class ActivityDetail extends React.Component {
  state = {
    detailData: {},
    selectedRowKeys: [],
    selectedRows: [],
    newuserExclusive: 0,
    memberExclusive: 0,
    minBuy: 0,
    maxBuy: 0,
    sort: 0,
    activityImage: [],
  };

  componentDidMount() {
    // console.log(new Decimal(1000).mul(100).toNumber(), '--------')
    const { selectedRowKeys, selectedRows } = this.state;
    const data = JSON.parse(localStorage.getItem('editsku') || {});
    map(data.promotionSkuList, (item, key) => {
      item.costPrice = Number(item.costPrice / 100);
      item.buyingPrice = Number(item.buyingPrice / 100);
      item.headPrice = Number(item.headPrice / 100);
      item.areaPrice = Number(item.areaPrice / 100);
      item.cityPrice = Number(item.cityPrice / 100);
      item.managerPrice = Number(item.managerPrice / 100);
      // 拼团
      item.promotionPrice = Number(item.promotionPrice / 100);
      item.pmHeadPrice = Number(item.pmHeadPrice / 100);
      item.pmAreaPrice = Number(item.pmAreaPrice / 100);
      item.pmCityPrice = Number(item.pmCityPrice / 100);
      item.pmManagerPrice = Number(item.pmManagerPrice / 100);
      if (item.selected) {
        selectedRowKeys.push(key);
        selectedRows.push(item);
      }
    });

    this.setState({
      detailData: data,
      selectedRowKeys,
      isMultiple: data.isMultiple,
      newuserExclusive: data.newuserExclusive,
      memberExclusive: data.memberExclusive,
      minBuy: data.minBuy,
      maxBuy: data.maxBuy,
      sort: data.sort,
      activityImage: initImgList(data.banner),
    });
  }

  setPromotionAddSKu = params => {
    setPromotionAddSKu(params).then(res => {
      if (res) {
        message.success('保存活动商品价格成功');
        this.handleReturn();
      }
    });
  };

  handleChangeValue = (text, index) => value => {
    const { detailData } = this.state;
    if (detailData.promotionSkuList && detailData.promotionSkuList[index]) {
      detailData.promotionSkuList[index][text] = value
    }
    this.setState({ detailData, sort: detailData.sort || 0 });
  };

  handleSave = () => {
    const {
      form: { validateFields }
    } = this.props;
    validateFields((err, vals) => {
      let msgs = []
      if (err) {
        const errs = flattenDeep(Object.keys(err).map(key => err[key].errors))
        msgs = errs.filter(item => item.pass).map(item => item.msg)
      }
      if (msgs.length) {
        Modal.confirm({
          title: <div style={{textAlign: 'center'}}>活动价格提醒</div>,
          icon: null,
          width: 800,
          content: <div style={{maxHeight: '60vh', overflow: 'auto'}}>{msgs.map(msg => (<div style={{marginBottom: '5px'}}>{msg}</div>))}</div>,
          onOk: () => {
            this.handleSetPromotionAddSKu()
          },
        });
      } else {
        this.handleSetPromotionAddSKu()
      }
    });
  };

  handleSetPromotionAddSKu = () => {
    if (this.loading) return;
    this.loading = true;
    const { isMultiple, detailData, selectedRows, newuserExclusive, sort, activityImage, memberExclusive, minBuy, maxBuy } = this.state;
    for (let index = 0; index < activityImage.length; index++) {
      if (!activityImage[index].url) {
        this.loading = false;
        return message.error('图片正在上传,请稍后...');
      }
    }
    const promotionSkuAdd = (selectedRows || []).map((item) => {
      return {
        ...item,
        buyingPrice: item.buyingPrice ? new Decimal(item.buyingPrice).mul(100).toNumber() : 0,
        // 拼团
        ...(detailData.type === 10 ? {
          promotionPrice: item.promotionPrice ? new Decimal(item.promotionPrice).mul(100).toNumber(): 0,
          headPrice: item.pmHeadPrice ? new Decimal(item.pmHeadPrice).mul(100).toNumber() : 0,
          areaPrice: item.pmAreaPrice ? new Decimal(item.pmAreaPrice).mul(100).toNumber() : 0,
          cityPrice: item.pmCityPrice ? new Decimal(item.pmCityPrice).mul(100).toNumber() : 0,
          managerPrice: item.pmManagerPrice ? new Decimal(item.pmManagerPrice).mul(100).toNumber() : 0,
        } : {})
      }
    });
    const params = {
      isMultiple: detailData.type === 9 ? isMultiple : 0,
      id: detailData.id,
      newuserExclusive,
      minBuy,
      maxBuy,
      memberExclusive,
      promotionSkuAdd,
      sort,
      banner: activityImage && activityImage[0] && replaceHttpUrl(activityImage[0].url),
    };
    setPromotionAddSKu(params).then(res => {
      if (res) {
        message.success('保存活动商品价格成功');
        this.handleReturn();
      }
    }).finally(() => {
      this.loading = false;
    })
  };

  handleSelectionChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  handleReturn = () => {
    const {
      history,
      match: {
        params: { id },
      },
    } = this.props;
    history.push(`/fresh/activity/info/edit/${id}`);
  };

  handleActivityImage = e => {
    this.setState({
      activityImage: e,
    });
  };
  getColumns = (detailData) => {
    const { getFieldDecorator, validateFields } = this.props.form
    return [
      {
        title: '规格名称',
        dataIndex: 'property',
      },
      {
        title: `活动价`,
        dataIndex: 'buyingPrice',
        width: 200,
        render: (text, record, index) => {
          return speedyInput('buyingPrice', text, record, index, detailData.promotionSkuList, this.handleChangeValue)(
            <FormItem
              wrapperCol={{span: 24}}
            >
              {
                getFieldDecorator(`buyingPrice-${index}`, {
                  initialValue: text
                })(
                  <InputNumber
                    style={{width: 140}}
                    min={0}
                    precision={2}
                    onChange={this.handleChangeValue('buyingPrice', index)}
                    onBlur={() => validateFields([`buyingPrice-${index}`])}
                  />
                )
              }
            </FormItem>
          );
        }
      },
      {
        title: '活动库存',
        dataIndex: 'inventory',
        render: (text, record, index) => {
          const props = {
            style: {
              width: 140
            },
            min: 0,
            precision: 0,
            value: text,
            onChange: this.handleChangeValue('inventory', index)
          }
          // if (record.sellableQty) {
          //   props.max = record.sellableQty
          // }
          return speedyInput('inventory', text, record, index, detailData.promotionSkuList, this.handleChangeValue)(<InputNumber {...props} />)
        },
      },
      {
        title: '商品可用库存',
        dataIndex: 'stock',
        render: (text, record, index) => {
          // 1.售后详情中 订单信息模块 需要添加订单类型的属性
          // 海淘商品可用库存需要读取保宏仓的可用库存数量，活动库存不可大于可用库存
          return <span>{record.sellableQty}</span>
        }
      },
      {
        title: '最大购买数',
        dataIndex: 'maxBuy',
        render: (text, record, index) => (
          speedyInput('maxBuy', text, record, index, detailData.promotionSkuList, this.handleChangeValue)(
            <InputNumber
              style={{width: 140}}
              min={0}
              precision={0}
              value={text}
              onChange={this.handleChangeValue('maxBuy', index)}
            />
          )
        ),
      },
      {
        title: '最小购买数',
        dataIndex: 'minBuy',
        render: (text, record, index) => (
          speedyInput('minBuy', text, record, index, detailData.promotionSkuList, this.handleChangeValue)(
            <InputNumber
              style={{width: 140}}
              min={0}
              precision={0}
              value={text}
              onChange={this.handleChangeValue('minBuy', index)}
            />
          )
        ),
      },
      {
        title: (
          <span>
            仅倍数购买<Tooltip title="限制采购时sku最少购买量的整倍数购买"><Icon style={{fontSize: 12,margin:'0 2px'}} type="exclamation-circle" /></Tooltip>
          </span>
        ),
        dataIndex: 'isMultiple',
        style: {
          display: 'none'
        },
        onHeaderCell: () => {
          return {
            style: {
              display: this.state.detailData.type === 9 ? '' : 'none'
            }
          }
        },
        onCell: () => {
          return {
            style: {
              display: this.state.detailData.type === 9 ? '' : 'none'
            }
          }
        },
        align: 'center',
        render: (text, record, index) => {
          return (
            <Checkbox
              checked={!!text}
              onChange={e => {
                let isMultiple = e.target.checked ? 1 : 0
                isMultiple = this.state.detailData.type === 9 ? isMultiple : 0
                this.handleChangeValue('isMultiple', index)(isMultiple)
              }}
            />
          )
        }
      }
    ]
  };
  render() {
    const { isMultiple, detailData, selectedRowKeys, sort, activityImage, newuserExclusive, memberExclusive, minBuy, maxBuy } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectionChange,
    };

    return (
      <>
        <Card title="商品详情">
          <div style={{ marginBottom: 20 }}>
            商品主图: <Image src={detailData.coverUrl} width={60} height={60} alt="" />
          </div>
          <Row style={{ height: 60 }}>
            <Col span={6}>活动商品: {detailData.productName}</Col>
            <Col span={6}>市场价: {formatMoneyWithSign(detailData.marketPrice)}</Col>
            <Col span={6}>销售价: {formatMoneyWithSign(detailData.salePrice)}</Col>
            <Col span={6}>成本价: {formatMoneyWithSign(detailData.costPrice)}</Col>
          </Row>
          <Row style={{ marginTop: 20, height: 60 }}>
            <Col span={6}>
              <div>
                最少购买量:{' '}
                <Input value={minBuy} style={{ width: 160 }} placeholder="请填写最少购买量" type="number" onChange={e => this.setState({ minBuy: e.target.value })}/>
              </div>
              <If condition={detailData.type === 9}>
                <div style={{marginTop: 40}}>
                  <span>
                    仅倍数购买<Tooltip title="限制采购时spu最少购买量的整倍数购买"><Icon style={{fontSize: 12,margin:'0 2px'}} type="exclamation-circle" /></Tooltip>
                  </span>
                  :&nbsp;
                  <Checkbox
                    checked={!!isMultiple}
                    style={{ width: 160 }}
                    onChange={e => this.setState({ isMultiple: e.target.checked ? 1 : 0 })}
                  />
                </div>
              </If>
            </Col>
            <Col span={6}>
              最大购买量:{' '}
              <Input value={maxBuy} style={{ width: 160 }} placeholder="请填写最大购买量" type="number"  onChange={e => this.setState({ maxBuy: e.target.value })}/>
            </Col>
            <Col span={6}>
              排序:{' '}
              <Input
                style={{ width: 80 }}
                value={sort}
                onChange={e => this.setState({ sort: e.target.value })}
              />
            </Col>
            <Col span={6}>
              <FormItem label="活动图片">
                <UploadView
                  listType="picture-card"
                  value={activityImage}
                  onChange={this.handleActivityImage}
                  listNum={1}
                  size={0.3}
                  placeholder="添加活动图片"
                />
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card style={{ marginTop: 10 }}>
          <div style={{color: 'red', fontSize: 12, marginBottom: 8}}>* 修改活动库存后，请点击同步更新，否则缓存期间会导致前端展示问题</div>
          <Table
            scroll={{ x: true }}
            rowSelection={rowSelection}
            columns={this.getColumns(detailData)}
            dataSource={detailData.promotionSkuList}
            pagination={false}
          />
        </Card>

        <Card style={{ marginTop: 10 }}>
          <Button type="primary" onClick={this.handleSave}>
            确定
          </Button>
          <Button type="danger" style={{ marginLeft: 10 }} onClick={this.handleReturn}>
            返回
          </Button>
        </Card>
      </>
    );
  }
}

export default Form.create()(ActivityDetail);
