import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Category } from 'src/app/models/category.model';
import { SubCategory } from 'src/app/models/subcategory.model';
import { CtrCategoriesService } from 'src/app/services/control-categories/ctr-categories.service';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';

@Component({
  selector: 'sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})
export class SubCategoryComponent implements OnInit {

  nombre: string = '';
  body: NgForm;
  formState: Boolean = true;
  subcategories: SubCategory[] = [];
  subcategory: SubCategory = new SubCategory();
  showModalCatgoryCreated = false;
  categories: Category[] = [];
  categoryName: string = '';

  selectOfForm : FormGroup;

  selectedOption: string;


  constructor(
    private endPoints$: EndpointsService,
    private controlCategories: CtrCategoriesService,
    private formBuilder : FormBuilder) { }

  ngOnInit(): void {

    this.controlCategories.getCategoryList().then((list) => {
      this.categories = list;
      console.log(this.categories);
    });

    this.selectOfForm = this.formBuilder.group({
      selectCategories:[null]
    });

    this.selectOfForm.get("selectCategories").valueChanges.subscribe((value) => {
      console.log(value);
    });


    //this.getCategoryList()

  }

  createSubCategory(body: NgForm) {
    this.endPoints$.createSubCategory(this.subcategory).subscribe({
      next: (res) => {
        this.showModalCatgoryCreated = true;
      }
    })
  }
  revealForm() {
    this.formState = !this.formState
  }

  /* getSubCategoryList() {
    this.service.getSubCategories(this.subcategory.categoryId).subscribe({
      next: (res) => {
        this.subcategories = res;
      }
    })
  } */
  selectCategory(){
    // this.getSubCategoryList()
  }
  /* getCategoryList() {
    this.service.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;
      }
    })
  } */

}
