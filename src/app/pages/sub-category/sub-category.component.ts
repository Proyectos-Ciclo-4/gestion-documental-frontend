import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Category } from 'src/app/models/category.model';
import { SubCategory } from 'src/app/models/subcategory.model';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';

@Component({
  selector: 'sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})
export class SubCategoryComponent implements OnInit {

  nombre: string = '';
  body: NgForm;
  formState: Boolean = false;
  subcategories: SubCategory[] = [];
  subcategory: SubCategory = new SubCategory();
  showModalCatgoryCreated = false;
  categories: Category[] = [];
  categoryName: string = '';



  constructor(private service: EndpointsService) { }

  ngOnInit(): void {
    this.getCategoryList()
    this.getSubCategoryList()

  }

  createSubCategory(body: NgForm){
    this.service.createSubCategory(this.subcategory).subscribe({
      next: (res) => {
        this.showModalCatgoryCreated = true;
      }
    })
  }
  revealForm(){
    this.formState = !this.formState
    console.log("ESTADO CAMBIADO")
  }
  getSubCategoryList() {
    this.service.getSubCategories(this.categoryName).subscribe({
      next: (res) => {
        this.subcategories = res;

      }
    })
  }
  getCategoryList() {
    this.service.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;
      }
    })
  }
}
