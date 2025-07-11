import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form-field',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form-field.component.html',
  styleUrl: './dynamic-form-field.component.scss'
})
export class DynamicFormFieldComponent {
  @Input() field!: any;
  @Input() form!: FormGroup;

  @Output() onFocus = new EventEmitter();
  @Output() onBlur = new EventEmitter();
  @Output() onFileChange = new EventEmitter();

  _onFocus(controlName: string) {
    this.onFocus.emit(controlName);
  }

  _onBlur(controlName: string) {
    this.onBlur.emit(controlName);
  }

  _onFileChange(event: Event, controlName: string) {
    this.onFileChange.emit({
      event, controlName,
    });
  }
}
