import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  nombre: string = '';
  body: NgForm;
  formState: Boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  createCategory(body: NgForm){
    console.log(body)
  }
  revealForm(){
    this.formState = !this.formState
    console.log("ESTADO CAMBIADO")
  }

}
