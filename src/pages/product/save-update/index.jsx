import React, {Component} from 'react';
import {Card, Form, Icon, Input, Button, Cascader, InputNumber} from "antd";
import {reqAddCategory, reqCategories, reqAddProduct, reqUpdateProduct, reqDeleteProductImg} from "../../../api";
import './index.less';
import PicturesWall from './picture-wall';
import RichTextEditor from './rich-text-editor';
import {convertToRaw} from 'draft-js';
import draftToHtml from "draftjs-to-html";

const {Item} = Form;

class SaveUpdate extends Component {

    state = {
        options: []
    };

    // ref获取普通标签，就是拿到真实DOM元素
    // 获取组件，就是拿到组件的实例对象
    richTextEditorRef = React.createRef();

    getCategories = async (parentId) => {
        const result = await reqCategories(parentId);
        if (parentId === '0') {
            this.setState({
                options: result.map((item) => {
                    return {
                        value: item._id,
                        label: item.name,
                        isLeaf: false,
                    }
                })
            })
        } else {
            this.setState({
                options: this.state.options.map((item) => {
                    if (item.value === parentId) {
                        item.children = result.map((item) => {
                            return {
                                value: item._id,
                                label: item.name
                            }
                        })
                    }
                    return item;
                })
            })
        }
    };

    async componentDidMount() {
        this.getCategories('0');
        //如果是一级分类：pCategoryId:0 categoryId：一级分类id；
        //  如果是二级分类：pCategoryId:一级分类id  categoryId是二类id；
        const product = this.props.location.state;

        let categoriesId = [];
        if (product) {
            if (product.pCategoryId !== '0') {
                categoriesId.push(product.pCategoryId);
                //请求二级分类数据
                this.getCategories(product.pCategoryId)
            }
            categoriesId.push(product.categoryId)
        }
        console.log(categoriesId)
        this.categoriesId = categoriesId;
    };

    // async componentDidMount() {
    //     const result = await reqCategories('0')
    //     if (result) {
    //         this.setState({
    //             options: result.map((item) => {
    //                 return {
    //                     value: item._id,
    //                     label: item.name,
    //                     isLeaf: false,
    //                     // 小尖尖的指向去下一级
    //                 }
    //             })
    //         })
    //     }
    //
    // }

    // async componentDidMount() {
    //     const result = await reqCategories('0');
    //     if (result) {
    //         this.setState({
    //             options: result.map((item) => {
    //                 return {
    //                     value: item._id,
    //                     label: item.name,
    //                     isLeaf: false,
    //                 }
    //             })
    //         })
    //     }
    // }

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
    loadData = async selectedOptions => {
        const targetOptions = selectedOptions[selectedOptions.length - 1]
        targetOptions.loading = true;
        const result = await reqCategories(targetOptions.value)
        if (result) {
            targetOptions.loading = false;
            targetOptions.children = result.map((item) => {
                return {
                    value: item._id,
                    label: item.name,
                }
            })
            this.setState({
                options: [...this.state.options]
            })
        }
    }
    goBack = () => {
        this.props.history.goBack();
    }
    addProduct = (e) => {
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
//     validateFields 是收集表单信息和验证表单
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {editorState} = this.richTextEditorRef.current.state;
                const detail = draftToHtml(convertToRaw(editorState.getCurrentContent()));
                const {name, desc, price, categoriesId} = values;
                let pCategoryId = '0';
                let categoryId = '';
                if (categoriesId.length === 1) {
                    categoryId = categoriesId[0]
                } else {
                    pCategoryId = categoriesId[0]
                    categoryId = categoriesId[1]
                }
                let promise = null;
                const product = this.props.location.state;
                const options = {name, desc, price, categoryId, pCategoryId, detail}

                //   const result = await reqAddProduct({ name, desc, price, categoryId, pCategoryId, detail })
                //              if(result){
                //                  this.props.history.push('/product/index')
                // }
                // 弟一种发送请求方式
                if (product) {
                    //更新、修改
                    options._id = product._id;
                    promise = reqUpdateProduct(options);

                } else {
                    promise = reqAddProduct(options);
                }
                const result = await promise;
                if (result) {
                    this.props.history.push('/product/index')
                }

            }
        })
    };

    render() {
        const product = this.props.location.state;
        const {getFieldDecorator} = this.props.form;
        const {options} = this.state;
        console.log(this.categoriesId)
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 2},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 10},
            }
        };
        return <Card
            title={<div className="product-title"><Icon type="arrow-left" onClick={this.goBack} className='arrow-icon'/><span>添加商品</span>
            </div>}>
            <Form {...formItemLayout} onSubmit={this.addProduct}>
                <Item label="商品名称">
                    {
                        getFieldDecorator(
                            'name',
                            {
                                rules: [{
                                    required: true, message: '请输入商品名称'
                                }],
                                initialValue: product ? product.name : ''
                            }
                        )(<Input placeholder="请输入商品名称"/>)
                    }

                </Item>
                <Item label="商品描述">
                    {
                        getFieldDecorator(
                            'desc',
                            {
                                rules: [{required: true, message: '请输入商品名称'}],
                                initialValue: product ? product.desc : ''

                            }
                        )(<Input placeholder="请输入商品描述"/>)
                    }

                </Item>
                <Item label="选择分类" wrapperCol={{span: 5}}>
                    {
                        getFieldDecorator(
                            'categoriesId',
                            {
                                rules: [{required: true, message: '请输入商品名称'}],
                                initialValue: this.categoriesId
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
                                ],
                                initialValue: product ? product.price : ''
                                //    这是一个默认值 initialValue
                            }
                        )(<InputNumber
                            // 格式化，对输入的数据进行格式化
                            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/￥\s?|(,*)/g, '')}
                            className="input-number"
                        />)

                    }

                </Item>
                <Item label="商品图片">
                    <PicturesWall imgs={product ? product.imgs : []} id={product ? product._id : ''}/>
                </Item>
                <Item label="商品详情" wrapperCol={{span: 20}}>
                    <RichTextEditor ref={this.richTextEditorRef} detail={product ? product.detail : ''}/>
                </Item>
                <Item>
                    <Button type="primary" className="add-product-btn" htmlType="submit">提交</Button>
                </Item>
            </Form>
        </Card>
    }
}

export default Form.create()(SaveUpdate)