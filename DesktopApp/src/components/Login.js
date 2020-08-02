import React from 'react'
import Navbar from "react-bootstrap/Navbar";
// import axios from 'axios';
import '../assets/css/index.css'
import {useHistory} from "react-router-dom";
import formleftimage from '../assets/imgs/signinbackground.jpg'
import formrightimage from '../assets/imgs/signupbackground.jpg'
import $ from 'jquery';

export default function Login(){
    const history = useHistory();
    let select = ''

    // let url = 'http://c311d61d3dee.ngrok.io/';

    function radioVal(event) {
        select = event.target.value
        console.log(select)
    }

    async function signIn() {
        let result = ''
        let data = {
            email: document.getElementById('email').value,
            psd: document.getElementById('password').value,
        }
        console.log(data)

        //  switch(select){
        //      case "Lawyer":{
        //          result = await axios({
        //              url: url+'lawyerLogin',
        //              method:'POST',
        //              headers: {"content-type": 'application/json' },
        //              data: data
        //          })
        //          console.log(data+"inside lawyer")
        //          break

        //      }
        //      case "Police":{
        //          result = await axios({
        //              url: url+'policeColl',
        //              method:'POST',
        //              headers: {"content-type": 'application/json' },
        //              data: data
        //          })
        //          console.log(data+"inside police")
        //          break
        //      }
        //      case "Judge":{
        //          result = await axios({
        //              url: url+'judgeLogin',
        //              method:'POST',
        //              headers: {"content-type": 'application/json' },
        //              data: data
        //          })
        //          console.log(data+"inside judge")
        //          break
        //      }
        //      case "User":{
        //          result = await axios({
        //              url: url+'login',
        //              method:'POST',
        //              headers: {"content-type": 'application/json' },
        //              data: data
        //          })
        //          console.log(data+"inside user")
        //         break
        //      }
        //  }
        //  localStorage.setItem("token",result.data.token);
        history.push('/dashboard');
    }

    async function register () {
        let result, data
        data = {
            username: document.getElementById('name').value,
            email: document.getElementById('emailId').value,
            psw: document.getElementById('pass').value,
            category: select
        }
         result = await axios({
                 url: url+'register',
                 method:'POST',
                 headers: {"content-type": 'application/json' },
                 data: data
         })
         localStorage.setItem("token",result.data.token);
        console.log(data)
    }


    $(document).ready(function(){
        document.querySelector('.signUp').addEventListener('click',function()
        {
            document.querySelector('.login-container').classList.toggle('active')
        });

        document.querySelector('.signIn').addEventListener('click',function()
        {
            document.querySelector('.login-container').classList.toggle('active')
        });

    });

    return (
        <div>
            <Navbar collapseOnSelect expand="xl" fixed='top' style={{background:'#232F34'}}>
                <Navbar.Brand href="#" style={{color:'white',fontWeight:'bold'}}>
                    E-Varta</Navbar.Brand>
            </Navbar>
            <section>
                <div className="login-container">
                    <div className="user signinBx" >
                        <div className="imgBx"><img src={formleftimage}></img></div>
                        <div className="formBx">
                            <div>
                                <h2>Sign In</h2>
                                <input id="email" type="email" name="email" placeholder="Email Address"/>
                                <input id="password" type="password" name="password" placeholder="Password"/>
                                <div onChange={radioVal} className="d-flex justify-content-center">
                                    <label htmlFor="" className="px-2">
                                        <input id="lawyer" type="radio" value="Lawyer" name="Meeting"/>
                                        Lawyer
                                    </label>
                                    <label htmlFor="" className="px-2">
                                        <input id="police" type="radio" value="Police" name="Meeting"/>
                                        Police
                                    </label>
                                    <label htmlFor="" className="px-2">
                                        <input id="judge" type="radio" value="Judge" name="Meeting"/>
                                        Judge
                                    </label>
                                    <label htmlFor="" className="px-2">
                                        <input id="user" type="radio" value="User" name="Meeting"/>
                                        User
                                    </label>
                                </div>
                                <input type="submit" onClick={signIn} className="" name="" value="Login"/>
                                <p className="signup">Dont have an Account? <a href="#" className="signUp">Sign Up</a></p>
                            </div>
                        </div>
                    </div>
                    <div className="user signupBx" id="signInBx">
                        <div className="formBx">
                            <div>
                                <h2>Create an Account</h2>
                                <input type="text" id="name" name="name" placeholder="Name"/>
                                <input type="email" id="emailId" name="email" placeholder="Email Address"/>
                                <input type="password" id="pass" name="password" placeholder="Password"/>
                                <div onChange={radioVal} className="d-flex justify-content-center">
                                    <label htmlFor="" className="px-2">
                                        <input id="lawyer" type="radio" value="Lawyer" name="Meeting"/>
                                        Lawyer
                                    </label>
                                    <label htmlFor="" className="px-2">
                                        <input id="police" type="radio" value="Police" name="Meeting"/>
                                        Police
                                    </label>
                                    <label htmlFor="" className="px-2">
                                        <input id="judge" type="radio" value="Judge" name="Meeting"/>
                                        Judge
                                    </label>
                                    <label htmlFor="" className="px-2">
                                        <input id="user" type="radio" value="User" name="Meeting"/>
                                        User
                                    </label>
                                </div>
                                <input type="submit" onClick={register} value="Sign Up"/>
                                <p className="signup">Already have an Account? <a href="#" className="signIn">Sign In</a></p>
                            </div>
                        </div>
                        <div className="imgBx"><img src={formrightimage}></img></div>
                    </div>
                </div>
            </section>
        </div>
    )
}
