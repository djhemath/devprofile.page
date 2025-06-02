import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit {
  @Input() config: any[] = [];
  @Output() onSave = new EventEmitter();
  @Output() onChange = new EventEmitter();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const group: any = {};
    this.config.forEach(field => {
      const control = this.fb.control(
        field.defaultValue || '',
        field.required ? Validators.required : []
      );
      group[field.id] = control;
    });

    this.form = this.fb.group(group);

    this.form.valueChanges.subscribe(value => this.onChange.emit(value));
  }

  submit() {
    if (this.form.valid) {
      console.log('Submitted:', this.form.value);
      this.onSave.emit(this.form.value);
    } else {
      console.warn('Form is invalid');
    }
  }
}
