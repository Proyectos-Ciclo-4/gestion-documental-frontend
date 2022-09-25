import { Injectable } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { SubCategory } from 'src/app/models/subcategory.model';
import { EndpointsService } from '../endpoints/endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class CtrCategoriesService {

  constructor(private endPoints$: EndpointsService) { }

  async getCategoryList(): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      this.endPoints$.getAllCategories().subscribe({
        next: (res) => { resolve(res); }
      });
    })
  }

  async getSubCategoryList(category: string): Promise<SubCategory[]> {
    return new Promise((resolve, reject) => {
      this.endPoints$.getSubCategories(category).subscribe({
        next: (res) => { resolve(res); }
      });
    })
  }

}
