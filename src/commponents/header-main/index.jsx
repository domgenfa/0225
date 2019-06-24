import React, { Component } from 'react';
import {withRouter}from 'react-router-dom';
//传一个高阶组件路
import MyButton from '../my-button';
import {Modal}from 'antd';
import logo from '../../assets/images/logo.png';
import './index.less';
import {getItem,removeItem} from "../../utils/storage-tools";
import menuList from '../../config/menu-config';

 class HeaderMain extends Component {

    //只要读取一次
    componentWillMount() {
        this.username = getItem().username;
         // this.title= this.getTitle(this.props)
    }
    logout =()=>{
        Modal.confirm({
            title:'您确认要退出登录吗？',
            onOk:()=>{
                // 清空数据
                removeItem();
                // 退出登录
                this.props.history.replace('/login')
            }

        })

}
    render() {
        return <div>
            <div className="header-main-top">
                <span>欢迎, {this.username}</span>
                <MyButton onClick={this.logout}>退出</MyButton>
            </div>
            <div className="header-main-bottom">
                <span className="header-main-left">用户管理</span>
                <div className="header-main-right">
                    <span>{Date.now()}</span>
                    <img src={logo} alt=""/>
                    <span>晴</span>
                </div>
            </div>
        </div>;
    }
}
export default withRouter(HeaderMain);