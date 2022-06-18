import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-control-errors',
  templateUrl: './control-errors.component.html',
  styleUrls: ['./control-errors.component.css']
})
export class ControlErrorsComponent implements OnInit {

  @Input('erros')
  errors: Map<string, string> | any;

  @Input()
  control: FormControl;

  isValid: boolean = false;
  message: string;

  constructor() { }
  
  ngOnInit(): void {
    this.errors = new Map(Object.entries(this.errors));
    this.isValid = this.control.valid;
    this.setErrorMessage();
    this.control.statusChanges.subscribe(value => {
      this.isValid = value === 'VALID';
      this.setErrorMessage();
    })
  }

  private setErrorMessage() {
    if (!this.isValid && this.control.errors) {
      const errorName = Object.keys(this.control.errors)[0]; 
      this.message = this.errors.get(errorName);
    }
  }
}
