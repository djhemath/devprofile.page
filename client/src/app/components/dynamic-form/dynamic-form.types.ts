export type BaseField<T extends string, D = unknown> = {
  id: string;
  label: string;
  type: T;
  placeholder: string;
  defaultValue?: D;
  required: boolean;
  helpText?: string;
};

export type TextField = BaseField<"text", string>;
export type TextareaField = BaseField<"textarea", string>;
export type NumberField = BaseField<"number", number>;
export type EmailField = BaseField<"email", string>;
export type URLField = BaseField<"url", string>;
export type DateField = BaseField<"date", string>; // ISO string
export type FileField = BaseField<"file">;
export type ColorField = BaseField<"color", string>; // Hex value

export type Option = {
  id: string;
  label: string;
};

export type DropdownSingleField = BaseField<"dropdown-single", string> & {
  options: Option[];
};

export type DropdownMultipleField = BaseField<"dropdown-multiple", string[]> & {
  options: Option[];
};

export type CheckboxField = BaseField<"checkbox", boolean>;

export type RadioGroupField = BaseField<"radio-group", string> & {
  options: Option[];
};

export type RepeatableGroupField = {
  id: string;
  label: string;
  type: "repeatableGroup";
  singlularLabel: string;
  minItems?: number;
  maxItems?: number;
  helpText?: string;
  fields: Field[]; // recursive
};

export type Field =
  | TextField
  | TextareaField
  | NumberField
  | EmailField
  | URLField
  | DateField
  | FileField
  | ColorField
  | DropdownSingleField
  | DropdownMultipleField
  | CheckboxField
  | RadioGroupField
  | RepeatableGroupField;

export type FormSchema = Field[];