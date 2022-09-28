import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { CtrCategoriesService } from 'src/app/services/control-categories/ctr-categories.service';
import { EndpointsService } from '../../services/endpoints/endpoints.service';
import { ControlSesion } from 'src/app/utils/controlSesion';
@Component({
  selector: 'category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {

  controlSesion = new ControlSesion();
  showModalCatgoryCreated = false;
  nombre: string = '';
  body: NgForm;
  formState: Boolean = false;
  categories: Category[] = [];
  category: Category = new Category();
  page: number = 1;

  documentForm = new FormGroup({
    text_new_category: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  constructor(
    private service: EndpointsService,
    private controlCategories: CtrCategoriesService,
    private router: Router
  ) { }


  ngOnInit(): void {

    switch (this.controlSesion.getTypeUser()) {
      case null:
        this.router.navigate(['']);
        break;
      case 555:
        this.router.navigate(['document']);
        break;
      case 700:
        this.getCategories();
        break;
    };

  }

  createCategory(body: NgForm) {
    this.service.createCategory(this.category).subscribe({
      next: (resp) => {
        this.showModalCatgoryCreated = true;
      },
      complete: () => {
        this.categories = [];
        this.getCategories();
      },
    });
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
