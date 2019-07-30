import React, { Component } from 'react';
import { connect } from '@/util/utils';
import { Row, Col, Button, Input } from 'antd';
import styles from './index.module.scss';


export default class categorySelect extends Component {

    state = {
        activityItem: null,
        inputValue: ''
    }

    onInputChange = e => {
        this.setState({
            inputValue: e.target.value
        })
    }

    onItemClick = (item, index) => {
        const { onItemClick } = this.props;
        if (typeof onItemClick === 'function') onItemClick(item);
        this.setState({
            activityItem: index
        })
    }

    onDelClick = (item) => {
        const { onDelClick } = this.props;
        if (typeof onDelClick === 'function') onDelClick(item)
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.data !== this.props.data) {
    //         this.setState({
    //             activityItem: null
    //         })
    //     }
    // }

    render() {
        const { buttonText, data = [], onSearch, renderActions, onBtnClick } = this.props;
        const { activityItem, inputValue } = this.state;
        return (
            <div className={styles.box}>
                <div className={styles.header}>
                    <Input size="small" style={{ width: '40%' }} onChange={this.onInputChange} allowClear/>
                    <Button size="small" type="primary" icon="search" style={{ margin: '0 10px' }} onClick={() => onSearch(inputValue)}>搜索</Button>
                    <Button size="small" type="primary" icon="plus" onClick={onBtnClick}>{buttonText}</Button>
                </div>
                <div className={styles.content}>
                    {
                        data.length ? data.map((item, index) => {
                            return (
                                <div
                                    className={[styles.item, activityItem === index ? styles.activity : ''].join(' ')}
                                    key={index}
                                >
                                    <span className={styles.name} onClick={() => this.onItemClick(item, index)}>{item.name}</span>
                                    <span className={styles.actions}>
                                        {
                                            typeof renderActions === 'function' ? renderActions(item) : ''
                                        }
                                    </span>
                                </div>
                            )
                        }) : <div style={{ textAlign: 'center', padding: '10px' }}>暂无数据</div>
                    }
                </div>
            </div>
        )
    }
}