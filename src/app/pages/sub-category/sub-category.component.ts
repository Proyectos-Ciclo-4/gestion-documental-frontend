import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { SubCategory } from 'src/app/models/subcategory.model';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';
import { ControlSesion } from 'src/app/utils/controlSesion';

@Component({
  selector: 'sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css'],
})
export class SubCategoryComponent implements OnInit {

  controlSesion = new ControlSesion();

  nombre: string = '';
  formState: Boolean = false;
  showModalCatgoryCreated = false;

  selectedOption: string = '0';
  page: number = 1;

  // for create subcategory
  categories: Category[] = [];

  // for list subcategory
  subCategoriesForList: SubCategory[] = [];

  documentForm = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
    category: new FormControl('', { validators: [Validators.required] }),
  });

  constructor(
    private service: EndpointsService,
    private router: Router) { }

  protected async submit() {

    const docName = this.documentForm.get('name');
    const docCategory = this.documentForm.get('category');

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
    switch (this.controlSesion.getTypeUser()) {
      case null:
        this.router.navigate(['']);
        break;
      case 555:
        this.router.navigate(['document']);
        break;
      case 700:
        this.getCategoryList();
        break;
    };
  }

  revealForm() {
    this.formState = !this.formState;
  }

  getSubCategoryForList() {
    this.service.getSubCategories(this.selectedOption).subscribe({
      next: (res) => {
        this.subCategoriesForList = res;
      },
    });
  }

  getCategoryList() {
    this.service.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
    });
  }
}
