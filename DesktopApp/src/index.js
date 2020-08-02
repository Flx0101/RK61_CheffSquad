import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';

import * as serviceWorker from './serviceWorker';
import '../src/assets/css/bootstrap.css';
// import ListCase from "./components/ListCase";
// import Schedule from "./components/Schedule";
// import Video from "./components/video"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
let root = document.createElement('div');
root.id = "root";
document.body.append(root);

render(
    < Router >
      <div >
        <Route exact path ="/" component = { Login }/>
        {/* <Route path = "/listcase" component = {ListCase}/>
        <Route path = "/schedule" component = { Schedule }/> */}
        <Route path="/dashboard" component={Dashboard}/>
      </div>
    </Router>,document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

// // Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
// Now we can render our application into it
