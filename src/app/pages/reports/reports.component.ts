import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ControlSesion } from 'src/app/utils/controlSesion';

@Component({
  selector: 'reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  controlSesion = new ControlSesion();
  
  formReports = new FormGroup({
    date_start: new FormControl('', { validators: [Validators.required] }),
    date_end: new FormControl('', { validators: [Validators.required] }),
    report_type: new FormControl('', { validators: [Validators.required] })
  });

  constructor(private router: Router) { }

  ngOnInit(): void {

    switch (this.controlSesion.getTypeUser()) {
      case null:
        this.router.navigate(['']);
        break;
      case 555:
        this.router.navigate(['document']);
        break;
    };
  }

}
