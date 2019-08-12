import React from 'react';
import { Card, Row, Col, Form, Table, Input, Button, Checkbox, message } from 'antd';
import { formatMoneyWithSign } from '../../helper';
import { map } from 'lodash';
import UploadView from '../../../components/upload';
import { setPromotionAddSKu } from '../api';
import Image from '../../../components/Image';
import {Decimal} from 'decimal.js';
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

class ActivityDetail extends React.Component {
  state = {
    detailData: {},
    selectedRowKeys: [],
    selectedRows: [],
    newuserExclusive: 0,
    sort: 0,
    activityImage: [],
  };

  componentDidMount() {
    const { selectedRowKeys, selectedRows } = this.state;
    const data = JSON.parse(localStorage.getItem('editsku') || {});
    map(data.promotionSkuList, (item, key) => {
      item.buyingPrice = Number(item.buyingPrice / 100);
      if (item.selected) {
        selectedRowKeys.push(key);
        selectedRows.push(item);
      }
    });

    this.setState({
      detailData: data,
      selectedRowKeys,
      newuserExclusive: data.newuserExclusive,
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

  handleChangeValue = (text, index) => e => {
    const { detailData } = this.state;
    detailData.promotionSkuList[index][text] = e.target.value;
    this.setState({ detailData, sort: detailData.sort || 0 });
  };

  handleSavae = () => {
    if(this.loading) return;
    this.loading = true;
    const { detailData, selectedRows, newuserExclusive, sort, activityImage } = this.state;
    if (activityImage.length === 0) {
      message.error('请上传活动商品图');
      this.loading = false;
      return false;
    }
    for (let index = 0; index < activityImage.length; index++) {
      if(!activityImage[index].url) {
        this.loading = false;
        return message.error('图片正在上传,请稍后...');
      }
    }
    map(selectedRows, item => {
      item.buyingPrice = new Decimal(item.buyingPrice).mul(100).toNumber();
    });

    const params = {
      id: detailData.id,
      newuserExclusive,
      promotionSkuAdd: selectedRows,
      sort,
      banner: activityImage && replaceHttpUrl(activityImage[0].url),
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
    history.push(`/activity/info/edit/${id}`);
  };

  handleActivityImage = e => {
    this.setState({
      activityImage: e,
    });
  };

  render() {
    const columns = [
      {
        title: '规格名称',
        dataIndex: 'property',
      },
      {
        title: '活动价',
        dataIndex: 'buyingPrice',
        render: (text, record, index) => (
          <Input value={text} onChange={this.handleChangeValue('buyingPrice', index)} />
        ),
      },
      {
        title: '活动库存',
        dataIndex: 'inventory',
        render: (text, record, index) => (
          <Input value={text} onChange={this.handleChangeValue('inventory', index)} />
        ),
      },
      {
        title: '最大购买数',
        dataIndex: 'maxBuy',
        render: (text, record, index) => (
          <Input value={text} onChange={this.handleChangeValue('maxBuy', index)} />
        ),
      },
      {
        title: '最小购买数',
        dataIndex: 'minBuy',
        render: (text, record, index) => (
          <Input value={text} onChange={this.handleChangeValue('minBuy', index)} />
        ),
      },
    ];

    const { detailData, selectedRowKeys, sort, activityImage, newuserExclusive, memberExclusive } = this.state;

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
              新人专享:{' '}
              <Checkbox
                checked={!!newuserExclusive}
                onChange={e => this.setState({ newuserExclusive: e.target.checked ? 1 : 0 })}
              >
                是
              </Checkbox>
            </Col>
            <Col span={6}>
              会员专享:{' '}
              <Checkbox
                checked={!!memberExclusive}
                onChange={e => this.setState({ memberExclusive: e.target.checked ? 1 : 0 })}
              >
                是
              </Checkbox>
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
                  size={0.5}
                  placeholder="添加活动图片"
                />
              </FormItem>
            </Col>
            <Col span={8} />
          </Row>
        </Card>
        <Card style={{ marginTop: 10 }}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={detailData.promotionSkuList}
            pagination={false}
          />
        </Card>

        <Card style={{ marginTop: 10 }}>
          <Button type="primary" onClick={this.handleSavae}>
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
