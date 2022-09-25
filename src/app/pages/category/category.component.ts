import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Category } from 'src/app/models/category.model';
import { CtrCategoriesService } from 'src/app/services/control-categories/ctr-categories.service';
import { EndpointsService } from '../../services/endpoints/endpoints.service'
@Component({
  selector: 'category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  showModalCatgoryCreated = false;
  nombre: string = '';
  body: NgForm;
  formState: Boolean = false;
  categories: Category[] = [];
  category: Category = new Category();


  constructor(
    private service: EndpointsService,
    private controlCategories: CtrCategoriesService
  ) { }

  ngOnInit(): void {
    this.controlCategories.getCategoryList().then((list) => {
      this.categories = list;
    });
  }

  createCategory(body: NgForm) {
    this.service.createCategory(this.category).subscribe({
      next: (resp) => {
        this.showModalCatgoryCreated = true;
      }
    })
  }
  revealForm() {
    this.formState = !this.formState
  }
}
