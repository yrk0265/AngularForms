import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { json } from 'express';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  val={
    email:'HF@gmail.com',
    password:'tetra890@'
  }


  constructor() {


  }

  ngOnInit() {

  }
  login(loginForm:NgForm,submit) {
    console.log(loginForm.value,loginForm.valid,submit);
    console.log('value:',this.val);
  }
  onEmailChange(event) {
    console.log(event);
  }
}
