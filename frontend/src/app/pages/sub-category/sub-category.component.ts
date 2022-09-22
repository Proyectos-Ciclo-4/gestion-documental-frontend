import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})
export class SubCategoryComponent implements OnInit {

  nombre: string = '';
  body: NgForm;
  formState: Boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  createSubCategory(body: NgForm){
    console.log(body)
  }
  revealForm(){
    this.formState = !this.formState
    console.log("ESTADO CAMBIADO")
  }
}
