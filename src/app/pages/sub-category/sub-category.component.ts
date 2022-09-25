import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category.model';
import { SubCategory } from 'src/app/models/subcategory.model';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';

@Component({
  selector: 'sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css'],
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
  selectedOption: string;

  documentForm = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
    category: new FormControl('', { validators: [Validators.required] }),
  });

  constructor(private service: EndpointsService) {}

  protected async submit() {

    const docName = this.documentForm.get('name');
    const docCategory = this.documentForm.get('category');
    console.log("name:", docName.value)
    console.log("category:", docCategory.value)
    this.service.createSubCategory({
      categoryId: docCategory.value,
      subCategoryName: docName.value,
    }).subscribe(n => {
      docName.setValue("");
      docCategory.setValue("");
      this.showModalCatgoryCreated = true;
    });
  }

  ngOnInit(): void {
    this.getCategoryList();
  }
  getSubcategoriesByCategory() {
    const docCategory = this.documentForm.get('category');
    this.service.getSubCategories(docCategory.value).subscribe({
      next: (res) => {
        this.subcategories = res;
      },
    });
  }
  revealForm() {
    this.formState = !this.formState;
  }
  getSubCategoryList() {
    this.service.getSubCategories(this.subcategory.categoryId).subscribe({
      next: (res) => {
        this.subcategories = res;
      },
    });
  }
  selectCategory() {
    this.getSubCategoryList();
  }
  getCategoryList() {
    this.service.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
    });
  }
}
