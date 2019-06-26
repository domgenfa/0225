import React, { Component } from 'react';
import {Route,Switch,Redirect} from "react-router-dom";
import Index from './index/index';
import SaveUpdate from './save-update';
import Detail from './detail';

export default class Product extends Component {
  render() {
    return <Switch>
      <Route path='/product/index' component={Index}/>

      <Route path='/product/detail' component={Detail}/>

      <Route path='/product/save-update' component={SaveUpdate}/>
      <Redirect to='/product/index'/>
    </Switch>

  }
}