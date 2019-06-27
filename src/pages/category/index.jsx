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
      subCategories:[],//二级分类列表
      isShowSubCategories: false,//是否显示二级分类列表
      isShowAddCategory:false,//商品显示
      isShowUpdateCategoryName:false,//修改品类
      loading:true,
  }
  // async componentDidMount() {
  //   const result = await reqCategories('0');
  //   if (result) {
  //     this.setState({categories: result});
  //   }
  // }
componentDidMount() {
      this.fetchCategories('0');
};
  fetchCategories = async (parentId)=>{
      this.setState({
          loading:true
      });
      const result = await reqCategories(parentId);
      if(result){
          if(parentId ==='0'){
              this.setState({categories:result});

          }else{
              this.setState({
                  subCategories:result,
                  isShowSubCategories:true
              })
          }
      }
      this.setState({
          loading:false
      })
  }


    addCategory = ( ) =>{
      const {form} = this.addCategoryForm.props;
      form.validateFields(async(err,values)=>{
          if(!err){
              const {parentId,categoryName} = values;
              const result  = await reqAddCategory(parentId,categoryName);
              if(result){
                  message.success('添加分类成功~', 2);
                  form.resetFields(['parentId','categoryName']);

                  const options = {
                      isShowAddCategory:false,
                  };
                  const {isShowSubCategories} =this.state;
                  if(result.parentId ==='0'){
                      options.categories=[...this.state.categories,result];

                  }else if (isShowSubCategories && result.parentId ===this.parentCategory._id){
                      options.subCategories =[...this.state.subCategories,result]
                  }
                  this.setState(options)
              }
          }
      })
}
   // addCategory=()=>{
   //     const {form} = this.addCategoryForm.props;
   //     form.validateFields(async(err,values)=>{
   //         if(!err){
   //             const {parentId ,categoryName}=values;
   //             //发送请求
   //             const result =await reqAddCategory(parentId ,categoryName);
   //
   //             if(result){
   //                 message.success('添加分类成功~', 2);
   //                 //清空数据
   //                 form.resetFields(['parentId']);
   //
   //                 // 二级分类不显示，一级要显示
   //                 const options ={
   //                     isShowAddCategory:false
   //                 };
   //
   //                 if(result.parentId ==='0'){
   //                     options.categories=[...this.state.categories,result]
   //                 }
   //
   //                 this.setState(options)
   //             }
   //         }
   //     })
   // };
   //切换显示
   toggleDisplay=(stateName,stateValue)=>{
       return ()=>{
           this.setState({
               [stateName]:stateValue
           })
       }
};

    category={};

   saveCategory = (category)=>{
       return ()=>{
           this.category = category;
           this.setState({
               isShowUpdateCategoryName: true
           })
       }
   };


   hideUpdateCategoryName = ()=>{
       //清空表单项的值
       this.updateCategoryNameForm.props.form.resetFields(['categoryName'])
       //隐藏对话框
       this.setState({
           isShowUpdateCategoryName:false
       })
   };
   updateCategoryName = ()=>{
       const {form} = this.updateCategoryNameForm.props;
       form.validateFields(async (err,values)=>{
           const {categoryName} = values;
           const categoryId = this.category._id;
           const result  = await reqUpdateCategoryName(categoryId,categoryName);
           if(result){
               const {parentId} = this.category;
               let categoryData = this.state.categories;
               let stateName = 'categories';
               if(parentId !=='0'){
                   categoryData = this.state.subCategories;
                   stateName = 'subCategories';
               }

           const categories = categoryData.map((category)=>{
               let {_id,name,parentId}=category;
               if(_id ===parentId){
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
           message.success("")
               this.state({
                   isShowUpdateCategoryName:false,
                   [stateName]:categories
               })
       }
   })
}
    // updateCategoryName = ()=>{
    //     const {form} =this.updateCategoryNameForm.props;
    //     form.validateFields(async (err,values)=>{
    //         if(!err){
    //             const {categoryId} = this.category._id;
    //             const {categoryName} = values;
    //         const result = await reqUpdateCategoryName(categoryId,categoryName);
    //         if(result){
    //             const {parentId} = this.category;
    //             let categoryData = this.state.categories;
    //             let stateName = 'categories';
    //             if(parentId !== '0'){
    //                 categoryData = this.state.subCategories;
    //                 stateName = 'subCategories';
    //
    //             }
    //             const categories = categoryData.map((category)=>{
    //                 let {_id,name,parentId}= category
    //                 if(_id ===categ)
    //             })
    //         }
    //         }
    //     })
    // }
   updateCategoryName = ()=>{
       const {form} =this.updateCategoryNameForm.props;
       form.validateFields(async(err,values)=>{
           if(!err){
               const {categoryName} =values;
               const categoryId = this.category._id;
               const result = await reqUpdateCategoryName(categoryId,categoryName);
               if(result){
                   const {parentId} = this.category;
                   let categoryData = this.state.categories;
                   let stateName = 'categories';
                   if(parentId !== '0'){
                       categoryData = this.state.subCategories;
                       stateName = 'subCategories'
                   }
                   const categories = categoryData.map((category)=>{
                       let {_id,name,parentId}=category;
                       if(_id===categoryId){
                           name = categoryName;
                           return {
                               _id,
                               name,
                              parentId
                           }
                       }
                       return category
                   });
                   form.resetFields(['categoryName']);
                   message.success("更新类名成功",2)
                   this.setState({
                       isShowUpdateCategoryName:false,
                       [stateName]:categories
                   })
               }
           }
       })
   };

showSubCategory = (category)=> {
    return async() => {
        this.parentCategory = category;
       this.fetchCategories(category._id)

    }
};
   goBack=()=>{
       this.setState({
           isShowSubCategories: false
       })
   }
// updateCategoryName = ()=>{
   //     const {form} = this.updateCategoryNameForm.props;
   //     form.validateFields(async (err,values)=>{
   //         //    收集表单信息，校验表单
   //         if(!err){
   //             const {categoryName} = values;
   //             const categoryId  =this.category._id;
   //             const result = await reqUpdateCategoryName(categoryId,categoryName)
   //             if(result){
   //                // /不想修改原数据
   //                 const categories = this.state.categories.map((category)=>{
   //                     let{_id,name,parentId} = category;
   //                     //找到对应的id的categoryId,修改分类名称
   //                     if(_id === categoryId){
   //                         name = categoryName;
   //                         return {
   //                             _id,
   //                             name,
   //                             parentId
   //                         }
   //                     }
   //                     return category
   //                 })
   //                 //清空表单项的值 ，隐藏对话框
   //                 form.resetFields(['categoryName'])
   //                 message.success('更新类名成功了',2)
   //                 this.setState({
   //                     isShowUpdateCategoryName:false,
   //                     categories
   //                 })
   //             }
   //         }
   //     })
   //     }

   // updateCategoryName=()=>{
   //     const {form}=this.updateCategoryNameForm.props;
   //     // 获取form的属性
   //     form.validateFields(async(err,values)=>{
   //         if(!err){
   //             const {categoryName}=values;
   //             const categoryId = this.category._id;
   //             const result = await reqUpdateCategoryName(categoryId,categoryName)
   //          if(result){
   //              const categories = this.state.categories.map((category)=>{
   //                  let{_id,name,parentId} = category;
   //                  if(_id ===categoryId){
   //                      console.log(11)
   //                      name = categoryName;
   //                      return {
   //                          _id,
   //                          name,
   //                          parentId
   //                      }
   //                  }
   //                  return category
   //              })
   //              console.log(categories)
   //              form.resetFields(['categoryName']);
   //              message.success('更新分类名称成功~', 2);
   //              this.setState({
   //                  isShowUpdateCategoryName:false,
   //                  categories
   //              })
   //          }
   //         }
   //     })
   // }
  render() {
    // 决定表头内容
      const {loading, categories,subCategories, isShowSubCategories, isShowAddCategory,isShowUpdateCategoryName } = this.state;
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
              {
                  this.state.isShowSubCategories ? null : <MyButton onClick={this.showSubCategory(category)}>查看其子品类</MyButton>
              }
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

    return <Card
        title={isShowSubCategories ? <div><MyButton onClick={this.goBack}></MyButton><Icon type ='arrow-right' />&nbsp;{this.parentCategory.name}</div>:'一级列表分类'}
        extra={<Button type="primary" onClick={this.toggleDisplay("isShowAddCategory",true)}><Icon type="plus" />添加品类</Button>}>
      <Table
          columns={columns}
          dataSource={isShowSubCategories ? subCategories:categories}
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
          loading={loading}
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