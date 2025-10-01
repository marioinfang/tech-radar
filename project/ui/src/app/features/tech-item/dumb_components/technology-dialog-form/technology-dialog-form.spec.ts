import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyDialogForm } from './technology-dialog-form';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TechCategory} from '../../../../models/tech-category.enum';
import {Technology} from '../../../../models/technology.model';
import {TechClassification} from '../../../../models/tech-classification.enum';
import {ReactiveFormsModule} from '@angular/forms';

// Mock data
const mockTechnology: Technology = {
  id: '1',
  name: 'Angular',
  category: TechCategory.FRAMEWORKS,
  classification: TechClassification.ADOPT,
  technologyDescription: 'Frontend framework',
  classificationDescription: 'Widely used',
  published: true
} as Technology;

describe('TechnologyDialogForm', () => {
  let component: TechnologyDialogForm;
  let fixture: ComponentFixture<TechnologyDialogForm>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<TechnologyDialogForm>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        TechnologyDialogForm,
        ReactiveFormsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { technology: mockTechnology } }
    ]
  }).compileComponents();

  fixture = TestBed.createComponent(TechnologyDialogForm);
  component = fixture.componentInstance;
  fixture.detectChanges();
  });

  it('should show technology', () => {
    expect(component.technologyForm.value.name).toBe(mockTechnology.name);
    expect(component.technologyForm.value.category).toBe(mockTechnology.category);
    expect(component.technologyForm.value.classification).toBe(mockTechnology.classification);
    expect(component.technologyForm.value.technologyDescription).toBe(mockTechnology.technologyDescription);
    expect(component.technologyForm.value.classificationDescription).toBe(mockTechnology.classificationDescription);
    expect(component.technologyForm.value.published).toBe(mockTechnology.published);
  });

  it('should validate name', () => {
    component.technologyForm.patchValue({ name: '' });
    expect(component.technologyForm.valid).toBeFalse();
  });

  it('should validate category', () => {
    component.technologyForm.patchValue({ category: '' });
    expect(component.technologyForm.valid).toBeFalse();
  });

  it('should validate technology desc', () => {
    component.technologyForm.patchValue({ technologyDescription: '' });
    expect(component.technologyForm.valid).toBeFalse();
  });

  it('should require classification when published is true', () => {
    component.technologyForm.patchValue({ published: true, classification: '', classificationDescription: '' });
    fixture.detectChanges();
    expect(component.technologyForm.get('classification')?.hasError('required')).toBeTrue();
    expect(component.technologyForm.get('classificationDescription')?.hasError('required')).toBeTrue();
  });

  it('should allow empty classification when published is false', () => {
    component.technologyForm.patchValue({ published: false, classification: '', classificationDescription: '' });
    fixture.detectChanges();
    expect(component.technologyForm.get('classification')?.valid).toBeTrue();
    expect(component.technologyForm.get('classificationDescription')?.valid).toBeTrue();
  });

  it('should close dialog on save if valid', () => {
    component.onSave();
    expect(dialogRefSpy.close).toHaveBeenCalled();
    const result = dialogRefSpy.close.calls.mostRecent().args[0];
    expect(result.technology.name).toBe(mockTechnology.name);
  });

  it('should not close dialog if invalid', () => {
    component.technologyForm.patchValue({ name: '' });
    component.onSave();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should close on cancel', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });
});
