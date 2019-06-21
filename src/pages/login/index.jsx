import React, {Component} from 'react';
import { Form, Icon, Input, Button,} from 'antd';
import  logo from './logo.png';
import './index.less';
const Item = Form.Item;
class Login extends Component{


    render(){
        const {getFieldDecorator}=this.props.form;
return <div>
    <header className="login-header">
        <img src={logo} alt=""/>
        <h1>React项目: 后台管理系统</h1>

    </header>
    <section>
        <h2>用户登录</h2>
        <Form>
           <Item>
               {
                 getFieldDecorator(
                    'username',

                     {
                         rules:[
                             {
                                 required:true,message:''
                             }
                         ]
                     }
                 )(
                     <input prefix={<Icon type="user"/>} placeholder="用户名"/>
                 )
               }
               <Item>

               </Item>
           </Item>
        </Form>
    </section>
</div>
    }
}
export default Form.create()(Login)