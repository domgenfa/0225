import React, { Component } from 'react';
import {Card,Form,Icon,Input,Button,Cascader,InputNumber} from "antd";
import {reqAddCategory, reqCategories,  reqAddProduct} from "../../../api";
import './index.less';
import RichTextEditor from './rich-text-editor';
import { convertToRaw } from 'draft-js';
import draftToHtml from "draftjs-to-html";
const {Item} = Form;
 class SaveUpdate extends Component {

  state={
    options:[]
  };
  richTextEditorRef=React.createRef();
   async componentDidMount(){
     const result = await reqCategories('0')
     if(result){
       this.setState({
         options:result.map((item)=>{
           return{
             value:item._id,
             label:item.name,
             isLeaf:false,
            // 小尖尖的指向去下一级
          }
        })
      })
    }

   }

  async componentDidMount(){
     const result = await reqCategories('0');
     if(result){
       this.setState({
         options:result.map((item)=>{
           return{
             value:item._id,
             label:item.name,
             isLeaf:false,
           }
         })
       })
     }
  }

//    loadData = async selectedOptions =>{
//      const targetSelectedOptions=selectedOptions[selectedOptions.length-1];
//      targetSelectedOptions.loading=true;
//      const result = await reqCategories(targetSelectedOptions.value);
//      if(result){
//        targetSelectedOptions.loading=false;
//          targetSelectedOptions.children=result.map((item)=>{
//           return {
//             value:item._id,
//             label:item.name,
//           }
//         });
//
//        this.setState({
//          options:[...this.state.options]
//        })
//      }
// };
loadData = async selectedOptions =>{
        const targetOptions =selectedOptions[selectedOptions.length-1]
        targetOptions.loading = true;
        const result  = await reqCategories(targetOptions.value)
          if(result){
      targetOptions.loading = false;
       targetOptions.children=result.map((item)=>{
      return{
        value:item._id,
        label:item.name,
      }
    })
    this.setState({
      options:[...this.state.options]
    })
  }
}
goBack = ()=>{
    this.props.history.goBack();
}
addProduct=(e)=>{
    e.preventDefault();

//     this.props.form.validateFields(async(err,values)=>{
//         if(!err){
//             const {editorState}=this.richTextEditorRef.current.state;
//             const detail = draftToHtml(convertToRaw(editorState.getCurrentContent()));
//        const {name,desc,price,categoriesId} = values;
//        let pCategoryId= '0';
//        let categoryId = '';
//        if(categoriesId.length===1){
//            categoryId= categoriesId[0];
//
//        }else{
//            pCategoryId = categoriesId[0];
//            categoryId = categoriesId[1]
//        }
//        const result = await reqAddProduct({ name, desc, price, categoryId, pCategoryId, detail });
//
//       if(result){
//           this.props.history.push('/product/index')
//       }
//         }
//
// })
    this.props.form.validateFields(async(err,values)=>{
        if(!err){
            const {editorState} = this.richTextEditorRef.current.state;
            const detail=draftToHtml(convertToRaw(editorState.getCurrentContent()));
            const {name,desc,price,categoriesId}=values;
            let pCategoryId ='0';
            let categoryId ='';
            if(categoriesId.length===1){
                categoryId=categoriesId[0]
            }else{
                pCategoryId =categoriesId[0]
                categoryId = categoriesId[1]
            }
              const result = await reqAddProduct({ name, desc, price, categoryId, pCategoryId, detail })
            if(result){
                this.props.history.push('/product/index')
            }
        }
    })
 }
  render() {
      const {getFieldDecorator }=this.props.form;
    const {options} = this.state;
    const formItemLayout = {
      labelCol:{
        xs:{span:24},
        sm:{span:2},
      },
      wrapperCol:{
        xs:{span:24},
        sm:{span:10},
      }
    };
    return  <Card title={<div className="product-title"><Icon type="arrow-left" onClick={this.goBack}className='arrow-icon'/><span>添加商品</span></div>}>
        <Form {...formItemLayout} onSubmit={this.addProduct}>
          <Item label="商品名称">
              {
                  getFieldDecorator(
                      'name',
                      {
                          rules:[{
                              required:true,message:'请输入商品名称'
                          }]
                      }
                  )( <Input placeholder="请输入商品名称"/>)
              }

          </Item>
          <Item label="商品描述">
              {
                  getFieldDecorator(
                      'desc',
                      {
                          rules:[{required: true,message:'请输入商品名称'}]
                      }
                  )(<Input placeholder="请输入商品描述"/>)
              }

          </Item>
          <Item label="选择分类" wrapperCol={{span: 5}}>
              {
                  getFieldDecorator(
                      'categoriesId',
                      {
                          rules:[{required: true,message:'请输入商品名称'}]
                      }
                  )(
                      <Cascader
                          options={options}
                          loadData={this.loadData}
                          changeOnSelect
                      />
                  )
              }

          </Item>
          <Item label="商品价格">
              {
                  getFieldDecorator(
                      'price',
                      {
                          rules: [
                              {required: true, message: '请输入商品价格'}
                          ]
                      }
                  )(<InputNumber
                      // 格式化，对输入的数据进行格式化
                      formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/￥\s?|(,*)/g, '')}
                      className="input-number"
                  />)

              }

          </Item>
          <Item label="商品详情" wrapperCol={{span: 20}}>
            <RichTextEditor ref={this.richTextEditorRef}/>
          </Item>
          <Item>
            <Button type="primary" className="add-product-btn" htmlType="submit">提交</Button>
          </Item>
        </Form>
    </Card>
  }
}
export default Form.create()(SaveUpdate)