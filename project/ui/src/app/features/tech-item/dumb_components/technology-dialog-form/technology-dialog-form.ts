import {Component, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatDialogActions, MatDialogContent} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {TechCategory} from '../../../../models/tech-category.enum';
import {TechClassification} from '../../../../models/tech-classification.enum';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {Technology} from '../../../../models/technology.model.js';

@Component({
  selector: 'app-technology-dialog-form',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatOption,
    MatSelect,
    MatSlideToggle
  ],
  templateUrl: './technology-dialog-form.html',
  styles: `
    mat-dialog-content {
      overflow: visible;
    }
    mat-form-field {
      width: 100%;
    }
  `,
  standalone: true,
})
export class TechnologyDialogForm implements OnInit {
  protected readonly TechnologyCategories = Object.values(TechCategory);
  protected readonly TechnologyClassifications = Object.values(TechClassification);

  private fb = inject(FormBuilder).nonNullable;
  private dialog = inject(MatDialogRef<TechnologyDialogForm>);
  private dialogData = inject<{technology: Technology}>(MAT_DIALOG_DATA)

  private static readonly NAME_MAX = 25;
  private static readonly DESC_MAX = 200;

  technologyForm = this.initForm();

  ngOnInit(): void {
    if (this.dialogData?.technology) {
      this.technologyForm.patchValue(this.dialogData.technology);
    }

    this.setupPublishedValidation();
  }

  onSave(): void {
    if (this.technologyForm.valid) {
      const formData = this.technologyForm.getRawValue();
      if (formData.classification === '') {
        formData.classification = null;
      }
      if (formData.classificationDescription === '') {
        formData.classificationDescription = null;
      }

      this.dialog.close({
        technology: { ...this.dialogData.technology, ...formData }
      });
    } else {
      this.technologyForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialog.close();
  }

  private initForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(TechnologyDialogForm.NAME_MAX)]],
      category: ['', Validators.required],
      classification: [null as string | null],
      technologyDescription: ['', [Validators.required, Validators.maxLength(TechnologyDialogForm.DESC_MAX)]],
      classificationDescription: [null as string | null],
      published: [true, Validators.required],
    });
  }

  private setupPublishedValidation(): void {
    const classification = this.technologyForm.get('classification')!;
    const classDescription = this.technologyForm.get('classificationDescription')!;

    const applyValidators = (published: boolean) => {
      if (published) {
        classification.setValidators([Validators.required]);
        classDescription.setValidators([Validators.required]);
      } else {
        classification.clearValidators();
        classDescription.clearValidators();
      }
      classification.updateValueAndValidity();
      classDescription.updateValueAndValidity();
    };

    applyValidators(this.technologyForm.get('published')!.value);

    this.technologyForm.get('published')!.valueChanges
      .subscribe(applyValidators);
  }
}
