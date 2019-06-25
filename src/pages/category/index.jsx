import React, { Component } from 'react';
import { Card, Button, Icon, Table,Modal,message } from 'antd';

import { reqCategories,reqAddCategory,reqUpdateCategoryName } from '../../api';

import MyButton from '../../components/my-button';
import './index.less';
import AddCategoryForm from './add-category-form';
import UpdateCategoryNameForm from './update-category-name';
export default class Category extends Component {
  state = {
      categories: [], // 一级分类列表
      isShowAddCategory:false,//商品显示
      isShowUpdateCategoryName:false,//修改品类

  }
  category={};
  async componentDidMount() {
    const result = await reqCategories('0');
    if (result) {
      this.setState({categories: result});
    }
  }


   addCategory=()=>{
       const {form} = this.addCategoryForm.props;
       form.validateFields(async(err,values)=>{
           if(!err){
               const {parentId ,categoryName}=values;
               //发送请求
               const result =await reqAddCategory(parentId ,categoryName);

               if(result){
                   message.success('添加分类成功~', 2);
                   //清空数据
                   form.resetFields(['parentId']);

                   // 二级分类不显示，一级要显示
                   const options ={
                       isShowAddCategory:false
                   };

                   if(result.parentId ===0){
                       options.categories=[...this.state.categories,result]
                   }

                   this.setState(options)
               }
           }
       })
   };
   //切换显示
   toggleDisplay=(stateName,stateValue)=>{
       return ()=>{
           this.setState({
               [stateName]:stateValue
           })
       }
};
   saveCategory = (category)=>{
       return ()=>{
           //保存要更新的分类数据
           this.category = category;
           this.setState({
               isShowUpdateCategoryName: true
           })
       }
   };
   hideUpdateCategoryName = ()=>{
       this.updateCategoryNameForm.props.form.resetFields(['categoryName'])
       this.setState({
           isShowUpdateCategoryName:false
       })
   };
   updateCategoryName=()=>{
       const {form}=this.updateCategoryNameForm.props;
       form.validateFields(async(err,values)=>{
           if(!err){
               const {categoryName}=values;
               const categoryId = this.category.Id;
               const result = await reqUpdateCategoryName(categoryId,categoryName)
            if(result){
                const categories = this.state.categories.map((category)=>{
                    let{_id,name,parentId} = category;
                    if(_id ===categoryId){
                        name = categoryName;
                        return {
                            _id,
                            name,
                            parentId
                        }
                    }
                    return category
                })
                form.resetFields(['categoryName']);
                message.success('更新分类名称成功~', 2);
                this.setState({
                    isShowUpdateCategoryName:false,
                    categories
                })
            }
           }
       })
   }
  render() {
    // 决定表头内容
      const { categories, isShowAddCategory,isShowUpdateCategoryName } = this.state;
    const columns = [
      {
        title: '品类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
       // dataIndex:'operation',
        className:'category-operation',
      render:category=>{
          return <div>
            <MyButton onClick={this.saveCategory(category)}>修改名称</MyButton>
            <MyButton>查看其子品类</MyButton>
          </div>
      }
      }

    ];

    // const data = [
    //   {
    //     key: '1',
    //     name:'手机',
    //     operation:'yyy',
    //   },
    //   {
    //     key: '2',
    //     name:'电脑',
    //     operation:'xxxx',
    //   }
    // ];

    return <Card title="一级分类列表" extra={<Button type="primary" onClick={this.toggleDisplay("isShowAddCategory",true)}><Icon type="plus" />添加品类</Button>}>
      <Table
          columns={columns}
          dataSource={categories}
          bordered
          pagination={{
              showSizeChanger:true,
             // 是否可展开
              pageSizeOptions:['3','6','9'],
            //每页的页数
            defaultPageSize:3,
            //默认页数
            showQuickJumper:true
          //  跳转
          }}
          rowKey ='id'
          />
        <Modal
            title="添加分类"
            visible={isShowAddCategory}
            onOk={this.addCategory}
            onCancel={this.toggleDisplay("isShowAddCategory",false)}
            okText="确认"
            cancelText="取消"
        >
            <AddCategoryForm categories={categories} wrappedComponentRef={(form) => this.addCategoryForm = form}/>
            {/*外部需要内部的数据*/}
        </Modal>
        <Modal
            title="修改品类"
            visible={isShowUpdateCategoryName}
            onOk={this.updateCategoryName}
            onCancel={this.hideUpdateCategoryName}
            okText="确认"
            cancelText="取消"
        >
            <UpdateCategoryNameForm categoryName={this.category.name} wrappedComponentRef={(form) => this.updateCategoryNameForm  = form}/>
        </Modal>

    </Card>
      }
    }