import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category.model';
import { CtrCategoriesService } from 'src/app/services/control-categories/ctr-categories.service';
import { EndpointsService } from '../../services/endpoints/endpoints.service';
@Component({
  selector: 'category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  showModalCatgoryCreated = false;
  showModalCatgoryExist = false;
  nombre: string = '';
  body: NgForm;
  formState: Boolean = false;
  categories: Category[] = [];
  categoriesToCompare: Category[] = [];
  category: Category = new Category();
  page: number = 1;
  existCategories: number = 0;

  documentForm = new FormGroup({
    text_new_category: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  constructor(
    private service: EndpointsService,
    private controlCategories: CtrCategoriesService
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }


  createCategory(body: NgForm) {
    this.service.getCategoriesToCompare(this.category.categoryName).subscribe({
      next: (res) => {
        this.categoriesToCompare = res;
        this.existCategories =  this.categoriesToCompare.length
        console.log("LAS QUE SE COMPARAN", this.categoriesToCompare,"total:", this.existCategories)
      }, complete: () => {
        if(this.existCategories == 0) {
          this.service.createCategory(this.category).subscribe({
            next: (resp) => {
              this.showModalCatgoryCreated = true;
            },
            complete: () => {
              this.categories = [];
              this.getCategories();

            },
          });
        } else {
          this.showModalCatgoryExist = true;
        }
      }
    })
  }
  revealForm() {
    this.formState = !this.formState;
  }

  getCategories() {
    this.controlCategories.getCategoryList().then((list) => {
      this.categories = list;
      this.categories.sort((a, b) => {
        if (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) {
          return 1;
        }
        if (a.categoryName.toLowerCase() < b.categoryName.toLowerCase()) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });

    });
  }
}
