import React, { Component } from 'react';
import {withRouter}from 'react-router-dom';
//传一个高阶组件路由
//引入时间库
import  dayjs from 'dayjs'
import MyButton from '../my-button';
import {Modal}from 'antd';

import './index.less';
import { reqWeather } from '../../api';
import {getItem,removeItem} from "../../utils/storage-tools";
import menuList from '../../config/menu-config';

 class HeaderMain extends Component {
        state={
            sysTime:Date.now(),
            weather:'睛',
            weatherImg:'http://api.map.baidu.com/images/weather/day/qing.png'
        }
    //只要读取一次
    componentWillMount() {
        this.username = getItem().username;
          this.title= this.getTitle(this.props)
    }
    async componentDidMount(){

        setInterval(()=>{
        this.setState({
            sysTime:Date.now()
        })
        },1000)
        const result= await reqWeather();
    }
      componentWillReceiveProps(nextProps, nextContext) {
         this.title = this.getTitle(nextProps)
         }
getTitle = (nextProps)=>{
    const {pathname}=nextProps.location;
    let title='';
    for(let i=0;i<menuList.length;i++){
        const menu = menuList[i];
        if(menu.children){
            for(let j=0;j<menu.children.length;j++){
                const item = menu.children[j];
                if(item.key===pathname){
                 return item.title;
                }
            }

        }else{
            if(menu.key===pathname){
                return menu.title;
            }
        }
    }

};
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
            // renden里面写，初始化要更新也要
            // 获取当前路径

            const {sysTime,weather,weatherImg}=this.state;
        return <div>
            <div className="header-main-top">
                <span>欢迎, {this.username}</span>
                <MyButton onClick={this.logout}>退出</MyButton>
            </div>
            <div className="header-main-bottom">
                <span className="header-main-left">{this.title}</span>
                <div className="header-main-right">
                    {/*时间转换*/}
                    <span>{dayjs(sysTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                    <img src={weatherImg} alt=""/>
                    <span>{weather}</span>
                </div>
            </div>
        </div>;
    }
}
export default withRouter(HeaderMain);