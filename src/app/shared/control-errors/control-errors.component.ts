import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-control-errors',
  templateUrl: './control-errors.component.html',
  styleUrls: ['./control-errors.component.css']
})
export class ControlErrorsComponent implements OnInit, OnChanges, OnDestroy {

  @Input('erros')
  errors: Map<string, string> | any;

  @Input()
  control: UntypedFormControl;

  isValid: boolean = false;
  message: string;

  subscription: Subscription;

  constructor() { }
  
  ngOnInit(): void {
    this.errors = new Map(Object.entries(this.errors));
    this.isValid = this.control.valid;
    this.setErrorMessage();
    this.subscribeOnStatusChanged();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.control.currentValue != changes.control.previousValue) {
      this.subscribeOnStatusChanged();  
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  private subscribeOnStatusChanged() {
    this.subscription = this.control.statusChanges.subscribe(value => {
      this.isValid = value === 'VALID';
      this.setErrorMessage();
    });
  }
  private setErrorMessage() {
    if (!this.isValid && this.control.errors) {
      const errorName = Object.keys(this.control.errors)[0]; 
      this.message = this.errors.get(errorName);
    }
  }
}
