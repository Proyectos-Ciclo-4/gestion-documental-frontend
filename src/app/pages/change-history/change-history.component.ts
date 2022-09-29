import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';

@Component({
  selector: 'change-history',
  templateUrl: './change-history.component.html',
  styleUrls: ['./change-history.component.css']
})
export class ChangeHistoryComponent implements OnInit {
  page: number = 1;

  constructor(
    private router: Router,
    private endpoint$: EndpointsService
  ) {}

  ngOnInit(): void {
  }



}
