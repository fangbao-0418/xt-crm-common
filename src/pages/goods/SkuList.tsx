import React from 'react';
import { Table, Card, Popover, Input, Button, message } from 'antd';
import { getColumns } from './constant';
import CardTitle from './CardTitle';
import SkuUploadItem from './SkuUploadItem';
import descartes from '../../util/descartes';
import styles from './edit.module.scss';
import { size, indexOf, map, concat } from 'lodash';
interface Props { }
interface SpecItem {
  specName: string;
  specPicture: any[];
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
  data: any[];
  noSyncList: any[];
  GGName: string;
  showImage: boolean;
  tempSpecInfo: TempSpecInfoItem[];
  tempSpuName: string;
  tempSpuPicture: any[];
}
class SkuList extends React.Component<Props, State>{
  state: State = {
    specs: [],
    specPictures: [],
    speSelect: [],
    spuName: [],
    data: [],
    noSyncList: [],
    GGName: '',
    showImage: false,
    tempSpecInfo: [],
    tempSpuName: '',
    tempSpuPicture: []
  }
  handleChangeValue = (text: any, record: any, index: any) => (e: any) => {
    const { data, noSyncList } = this.state;
    const nosync = noSyncList.includes(text);
    /**
     * 每个输入框改变
     */
    if (!nosync) {
      data[index][text] = e.target ? e.target.value : e;
    }
    /**
     * 同步修改一列的数值
     */
    else {
      data.forEach((item, inex) => {
        item[text] = e.target ? e.target.value : e
      })
    }
    this.setState({ data });
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
    const { tempSpuName, tempSpuPicture } = this.state.tempSpecInfo[key];
    if (!this.state.tempSpuName) {
      message.error('请设置规格名称');
      return false;
    }
    let specs = this.state.specs;
    const { content } = specs[key];
    /**
     * 规格值不能重名，重名提示"规格值不能重名"
     */
    if (content.find((v: SpecItem) => v.specName === tempSpuName)) {
      message.error('请不要填写相同的规格');
      return false;
    } else {
      content.push({
        specName: tempSpuName,
        specPicture: tempSpuPicture
      })
    }
    // const { speSelect, spuName, data } = this.state;
    // if (indexOf(speSelect[key].data, spuName[key]) === -1) {
    //   speSelect[key].data.push(spuName[key]);
    //   speSelect[key].render = (record: any) => <>{size(record.spuName) > key && record.spuName[key]}</>;
    // } else {
    // message.error('请不要填写相同的规格');
    // return false;
    // }
    // map(descartes(speSelect), (item: any, key: number) => {
    //   const skuList = concat([], item);
    //   data[key] = {
    //     ...data[key],
    //     spuName: skuList,
    //     propertyValue1: size(skuList) > 0 && skuList[0],
    //     propertyValue2: (size(skuList) > 1 && skuList[1]) || '',
    //   };
    // });

    this.setState({ specs, tempSpuName: '', tempSpuPicture: [] });
  };
  handleTabsAdd = () => {
    const { GGName } = this.state;
    if (!GGName) {
      message.error('请输入正确的规格名称');
      return false;
    }

    this.handleAdd(GGName);
  };
  /**
  * 删除规格
  */
  handleRemoveSpec = (index: number) => {
    const { specs } = this.state;
    specs.splice(index, 1);
    // let data: any = [];
    // if (specs.length === 0) {
    //   return this.setState({ specs, data });
    // }
    // map(descartes(speSelect), (item, key) => {
    //   const skuList = concat([], item);
    //   data[key] = {
    //     spuName: skuList,
    //     propertyValue1: size(skuList) > 0 && skuList[0],
    //     propertyValue2: (size(skuList) > 1 && skuList[1]) || '',
    //   };
    // });
    // speSelect[0] && (speSelect[0].render = (record: any) => <>{size(record.spuName) > 0 && record.spuName[0]}</>);
    // speSelect[1] && (speSelect[1].render = (record: any) => <>{size(record.spuName) > 1 && record.spuName[1]}</>);
    // this.setState({ speSelect, data: data });
    this.setState({ specs })
  };

  removeSpecWithCb = (key: number, index: number) => () => {
    const { specs } = this.state;
    specs[key].content.splice(index, 1);

    const delData: any = [];
    map(descartes(specs), (item, $1) => {
      const skuList = concat([], item);
      delData[$1] = {
        spuName: skuList,
        propertyValue1: size(skuList) > 0 && skuList[0],
        propertyValue2: (size(skuList) > 1 && skuList[1]) || '',
      };
    });

    this.setState({ specs, data: delData });
  };
  /**
   * 每个规格临时名称
   */
  withChangeSpuNameCb = (key: number) => (spuName: string) => {
    const { tempSpecInfo } = this.state;
    if (tempSpecInfo[key]) {
      tempSpecInfo[key].tempSpuName = spuName;
    }
    this.setState({
      tempSpecInfo
    })
  };
  /**
   * 每个规格临时图片
   */
  withChangeSpuPictureCb = (key: number) => (spuPicture: any[]) => {
    const { tempSpecInfo } = this.state;
    if (tempSpecInfo[key]) {
      tempSpecInfo[key].tempSpuPicture = spuPicture;
    }
    this.setState({ tempSpecInfo })
  }
  render() {
    const { spuName } = this.state;
    return (
      <Card
        title="添加规格项"
        style={{ marginTop: 10 }}
        extra={
          <Popover
            trigger="click"
            content={
              <div style={{ display: 'flex' }}>
                <Input
                  placeholder="请添加规格名称"
                  value={this.state.GGName}
                  onChange={e => {
                    this.setState({ GGName: e.target.value });
                  }}
                />
                <Button type="primary" style={{ marginLeft: 5 }} onClick={this.handleTabsAdd}>
                  确定
                </Button>
              </div>
            }
          >
            <a href="javascript:void(0);">添加规格</a>
          </Popover>
        }
      >
        {this.state.specs.map((spec, key) => {
          return (
            <Card
              key={key}
              type="inner"
              title={<CardTitle
                title={spec.title}
                index={key}
                onChange={(e: any) => {
                  this.setState({ showImage: e.target.checked })
                }}
              />}
              extra={
                <a href="javascript:void(0);" onClick={() => this.handleRemoveSpec(key)}>删除</a>
              }>
              <div className={styles.spulist}>
                {map(spec.content, (item: SpecItem, index: number) => (
                  <SkuUploadItem
                    value={item.specName}
                    spuPicture={item.specPicture}
                    key={`d-${index}`}
                    disabled
                    index={key}
                    showImage={this.state.showImage}
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
                    value={this.state.tempSpecInfo[key] && this.state.tempSpecInfo[key].tempSpuName}
                    spuPicture={this.state.tempSpecInfo[key] && this.state.tempSpecInfo[key].tempSpuPicture}
                    index={key}
                    onChangeSpuName={this.withChangeSpuNameCb(key)}
                    onChangeSpuPicture={this.withChangeSpuPictureCb(key)}
                    showImage={this.state.showImage}
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
            ...this.state.speSelect,
            ...getColumns(this.handleChangeValue)
          ]}
          dataSource={this.state.data}
          pagination={false}
        />
      </Card>
    )
  }
}

export default SkuList;