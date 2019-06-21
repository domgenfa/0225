import React, {Component} from 'react';
import { Form, Icon, Input, Button,} from 'antd';
import  logo from './logo.png';
import './index.less';
const Item = Form.Item;
class Login extends Component{
    login=(e)=>{
        e.preventDefault();
        //用来校验表单信息
        this.props.form.validateFields((error,values)=>{
            if(!error){
            const {username,password}= values;
            }else{
                console.log("登录表单校验失败：",error)
            }
        })
    }
    validator=(rule,value,callback)=>{
        const name = rule.fullField ==='username '? '用户名' : '密码';

    if(!value){
        callback(`必须输入${name}`)
    }else if(value.length<4){
        callback(`${name}必须大于4位`)
    }else if(value.length<15){
        callback(`${name}必须小于15位`)
    }else if(!/^[a-zA-Z_0_9]+$/.test(value)){
        callback(`${name}只能包含英文字母和数字或下划线`)
    }else{
        //不传，代表成功
        callback()
    }
 }
    render(){
        const {getFieldDecorator}=this.props.form;
        return <div className="login">
    <header className="login-header">
        <img src={logo} alt="logo"/>
        <h1>React项目: 后台管理系统</h1>
    </header>
    <section className="login-content">
        <h2>用户登录</h2>
        <Form onSubmit={this.login} className='login-form'>
           <Item>
               {
                 getFieldDecorator(
                    'username',
                     {
                         rules:[
                             {
                                 validator:this.validator
                                 // required:true,message:'请输入你的用户名'
                             },
                             // {min:4,massage:""},
                             // {max:12},
                             // {pattern:/^[a-zA-Z0_9]+$/,massage:"用户名包含英文"}
                         ]
                     }
                 )(
                     <Input className="login-input" prefix={<Icon type="user"/>} placeholder="用户名"/>
                 )
               }
           </Item>
               <Item>{
                   getFieldDecorator(
                        'password', {
                            rules:[{
                              validator:this.validator
                            }]
               }
                   )(
                       <Input className="login-input"
                           prefix={<Icon type="lock"  />}
                           type="password"
                           placeholder="密码"
                       />,
                   )
               }
               </Item>
          <Item>
              <Button type="primary" htmlType="submit" className="login-btn">登录</Button>
          </Item>
        </Form>
    </section>
</div>
    }
}
export default Form.create()(Login)