import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormArray,
  ValidatorFn,
  FormControl,
} from '@angular/forms';

import { DynamicFormFieldComponent } from '../dynamic-form-field/dynamic-form-field.component';
import { Field, FormSchema, RepeatableGroupField } from './dynamic-form.types';
import { formatDateToYMD } from '../../shared/utils/date.util';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormFieldComponent],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent {
  public _config: FormSchema = [];
  private _formData: Record<string, any> | null = null;

  @Input()
  set config(value: FormSchema) {
    this._config = value;
    this.buildForm();
  }

  @Input() form?: FormGroup;
  @Input() set formData(value: Record<string, any> | null) {
    this._formData = value;
    if (value && this.form) {
      this.patchFormValues(value);
    }
  }
  @Output() onSave = new EventEmitter<Record<string, any>>();
  @Output() onChange = new EventEmitter<Record<string, any>>();
  @Output() onFocus = new EventEmitter<string>();
  @Output() onBlur = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {}

  private buildForm(): void {
    const group: Record<string, any> = {};

    this._config.forEach(field => {
      group[field.id] = field.type === 'repeatableGroup'
        ? this.buildRepeatableArray(field)
        : this.createControl(field);
    });

    this.form = this.fb.group(group);
    if (this._formData) {
      this.patchFormValues(this._formData);
    }
    this.form.valueChanges.subscribe(value => this.onChange.emit(value));
  }

  private buildRepeatableArray(field: RepeatableGroupField): FormArray {
    const initialGroups: FormGroup[] = [];

    if (field.fields?.length) {
      const initialGroup = this.fb.group({});
      field.fields.forEach(subField =>
        initialGroup.addControl(subField.id, this.createControl(subField))
      );
      initialGroups.push(initialGroup);
    }

    return this.fb.array(initialGroups);
  }

  private createControl(field: Field): FormControl {
    return this.fb.control(this.getDefaultValue(field), {
      validators: this.getValidators(field),
    });
  }

  private getValidators(field: Field): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if ('required' in field && field.required) validators.push(Validators.required);
    if (field.type === 'email') validators.push(Validators.email);
    if (field.type === 'url') {
      validators.push(Validators.pattern(
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
      ));
    }

    return validators;
  }

  private getDefaultValue(field: Field): any {
    if ('defaultValue' in field && field.defaultValue !== undefined) {
      if (field.type === 'date') {
        return formatDateToYMD(field.defaultValue);
      }
      return field.defaultValue;
    }

    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'email':
      case 'url':
      case 'file':
      case 'radio-group':
      case 'date':
        return '';
      case 'number':
        return 0;
      case 'color':
        return '#000000';
      case 'checkbox':
        return false;
      case 'dropdown-single':
        return field.options?.[0]?.id ?? '';
      case 'dropdown-multiple':
        return field.options?.[0]?.id ? [field.options[0].id] : [];
      default:
        return '';
    }
  }

  /** Repeatable Group Helpers */

  addGroup(field: RepeatableGroupField): void {
    const formArray = this.getFormArray(field.id);
    const group = this.fb.group({});
    field.fields.forEach(f => group.addControl(f.id, this.createControl(f)));
    formArray.push(group);
  }

  removeGroup(fieldId: string, index: number): void {
    this.getFormArray(fieldId).removeAt(index);
  }

  isMaxReached(fieldId: string, maxItems?: number): boolean {
    if(!maxItems) return false;
    return this.getFormArray(fieldId).length >= (maxItems);
  }

  getFormArray(fieldId: string): FormArray {
    return this.form!.get(fieldId) as FormArray;
  }

  getFormArrayControls(fieldId: string): FormGroup[] {
    return this.getFormArray(fieldId).controls as FormGroup[];
  }

  isRepeatableGroup(field: Field): field is RepeatableGroupField {
    return field.type === 'repeatableGroup';
  }

  /** File Change Handling */

  onFileChange(
    { event, controlName }: { event: Event; controlName: string },
    index?: number,
    parentName?: string
  ): void {
    const input = event.target as HTMLInputElement;
    if (!input?.files?.length) return;

    const file = input.files[0];
    const control = index !== undefined && parentName
      ? (this.getFormArray(parentName).at(index) as FormGroup).get(controlName)
      : this.form!.get(controlName);

    control?.setValue(file);
  }

  /** Focus & Blur */

  onControlFocus(controlName: string): void {
    this.onFocus.emit(controlName);
  }

  onControlBlur(controlName: string): void {
    this.onBlur.emit(controlName);
  }

  /** Submit */

  submit(): void {
    if (this.form?.valid) {
      console.log('Submitted:', this.form.value);
      this.onSave.emit(this.form.value);
    } else {
      // Mark all controls as touched to trigger validation errors
      if (this.form) {
        this.markAllControlsAsTouched(this.form);
      }
      console.warn('Form is invalid');
    }
  }

  private markAllControlsAsTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllControlsAsTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  /**
   * Patches the reactive form with provided data.
   * Supports both simple fields and repeatable group fields (FormArray of FormGroups).
   */
  private patchFormValues(data: Record<string, any>): void {
    if (!this.form) return;

    Object.keys(data).forEach(fieldId => {
      const formControl = this.form!.get(fieldId);
      const fieldDefinition = this._config.find(f => f.id === fieldId);

      // Handle repeatable group fields
      if (
        formControl instanceof FormArray &&
        Array.isArray(data[fieldId]) &&
        fieldDefinition?.type === 'repeatableGroup'
      ) {
        this.patchRepeatableGroupField(
          formControl,
          data[fieldId],
          fieldDefinition as RepeatableGroupField
        );
        return;
      }

      // Handle regular fields
      if (formControl && fieldDefinition) {
        let value = data[fieldId];

        // Format date fields to 'yyyy-MM-dd'
        if (fieldDefinition.type === 'date') {
          value = formatDateToYMD(value);
        }

        formControl.patchValue(value);
      }
    });
  }

  /**
   * Patches a repeatable group field (FormArray of FormGroups).
   */
  private patchRepeatableGroupField(
    formArray: FormArray,
    items: any[],
    groupFieldDef: RepeatableGroupField
  ): void {
    // Ensure FormArray has the correct number of groups
    while (formArray.length < items.length) {
      const group = this.fb.group({});
      groupFieldDef.fields.forEach(field => {
        group.addControl(field.id, this.createControl(field));
      });
      formArray.push(group);
    }

    // Patch each FormGroup inside the FormArray
    items.forEach((item, index) => {
      const groupFields = groupFieldDef.fields;
      const patchedGroupValue: Record<string, any> = {};

      Object.keys(item).forEach(childKey => {
        const childFieldDef = groupFields.find(f => f.id === childKey);

        if (childFieldDef?.type === 'date') {
          patchedGroupValue[childKey] = formatDateToYMD(item[childKey]);
        } else {
          patchedGroupValue[childKey] = item[childKey];
        }
      });

      const group = formArray.at(index) as FormGroup;
      group.patchValue(patchedGroupValue);
    });
  }
}