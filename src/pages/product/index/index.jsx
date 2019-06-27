import React, { Component } from 'react';
import { Card, Button, Icon, Table, Select, Input } from 'antd';

import MyButton from '../../../components/my-button';
import {reqCategories, reqProducts} from '../../../api';
import './index.less';

const { Option } = Select;

export default class Index extends Component {
state ={
  products:[],
    total:0,
    loading:true,
};
  // async componentDidMount(){
  //   const result = await reqProducts(1,3);
  //   // console.log(result)
  //   if(result){
  //     this.setState({
  //         total:result.total,
  //       products:result.list,
  //     })
  //   }
  //   console.log(result)
  // }
   componentDidMount(){
this.getProducts(1,3)
  }
  getProducts = async (pageNum,pageSize)=>{
      this.setState({
          loading:true,
      });
    const result = await reqProducts(pageNum, pageSize)
    if(result){
        this.setState({
            products:result.list,
            total:result.total,
            loading:false
        })
    }

};
//     0

  showAddProduct = () => {
    this.props.history.push('/product/save-update');
  };
showUpdateProduct =(product)=>{
    return()=>{
        this.props.history.push('/product/save-update', product)
    //    路由这里面要传一个参数product
    }
}
  render(){
    const {products ,total,loading} = this.state;
    const columns = [
      {
        title:'商品名称',
        dataIndex:'name',
      },{
        title:'商品描述',
        dataIndex:'desc',
      },{
        title:'价格',
        dataIndex:'price',
      },{
        className: 'product-status',
        title: '状态',
        dataIndex:'status',
        render :(status)=>{
          return status ===1
              ? <div><Button type="primary">上架</Button> &nbsp;&nbsp;&nbsp;&nbsp;已下架</div>
              : <div><Button type="primary">下架</Button> &nbsp;&nbsp;&nbsp;&nbsp;在售</div>
        }
      },{
        className: 'product-status',
        title: '操作',
        render: (product) => {
          return <div>
            <MyButton>详情</MyButton>
            <MyButton onClick={this.showUpdateProduct(product)}>修改</MyButton>
          </div>
        }
      }
    ]

    return <Card
       title={
         <div>
           <Select defaultValue={0}>
             <Option Key ={0} value={0}>根据商品名称</Option>
             <Option Key ={0} value={0}>根据商品名称</Option>
           </Select>
           <Input placeholder="关键字" className="search-input"/>
           <Button type="primary">搜索</Button>
         </div>
    }
       extra={<Button type='primary' onClick={this.showAddProduct }><Icon type = 'plus'/>添加产品</Button>}
    >
    <Table
        columns={columns}
        dataSource={products}
        bordered
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['3', '6', '9', '12'],
          defaultPageSize: 3,
            total,
            onChange:this.getProducts,
            onShowSizeChange:this.getProducts
        }}
        rowKey='_id'
        loading={loading}
    />
    </Card>
  }
}


