import React, { Component } from 'react';
import { Icon, Menu } from "antd";
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import menuList from '../../config/menu-config';

import './index.less';
import logo from '../../assets/images/logo.png';

const { SubMenu, Item } = Menu;

class LeftNav extends Component {
    static propTypes ={
        collapsed:PropTypes.bool.isRequired
    }
    createMenu = (menu)=>{
        return <Item key={menu.key}>
                <Link to={menu.key}>
                    <Icon type={menu.icon}/>
                    <span>{menu.title}</span>
                </Link>
            </Item>
        }

    componentDidMount() {
            const {pathname}=this.props.location;

          this.menus=menuList.map((menu)=>{
              const children = menu.children;
              if(children){
                  return <SubMenu key={menu.key}
                                  title={
                                      <span>
                                          <Icon type={menu.icon}/>
                                          <span>{menu.title}</span>
                                      </span>
                                  }
                  >
                      {
                          children.map((item) => {
                              if (item.key === pathname) {
                                  // 说明当前地址是一个二级菜单，需要展开一级菜单
                                  // 初始化展开的菜单
                                  this.openKey = menu.key;
                              }
                              return this.createMenu(item);
                          })
                      }
                  </SubMenu>
              }else{
                      return this.createMenu(menu)
              }

          });
        this.selectedKey = pathname;
        }

    render(){
        const {collapsed}= this.props;
        return <div>
            <Link className='left-nav' to='/home'>
                <img src= {logo} alt=""/>
                <h1 style={{display:collapsed ? 'none' : 'display'}}> </h1>
            </Link>
            <menu theme="dark" defaultSelectedKeys={[this.selectedKey]} defaultOpenKeys={[this.openKey]} mode="inline">
                {
                    this.menus
                }
            </menu>
        </div>
    }
}
//withRouter是一个高阶组件，向非 路由组件传递三大属性：history,location,match
export default withRouter(LeftNav);