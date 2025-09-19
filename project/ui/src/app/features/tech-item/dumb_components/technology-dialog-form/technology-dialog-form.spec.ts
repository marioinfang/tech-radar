import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyDialogForm } from './technology-dialog-form';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

describe('TechnologyDialogForm', () => {
  let component: TechnologyDialogForm;
  let fixture: ComponentFixture<TechnologyDialogForm>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<TechnologyDialogForm>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatButtonModule
      ],
      providers: [
      { provide: MatDialogRef, useValue: dialogRefSpy },
      { provide: MAT_DIALOG_DATA, useValue: { technology: {} } }
    ],
      declarations: [TechnologyDialogForm]
  }).compileComponents();

  fixture = TestBed.createComponent(TechnologyDialogForm);
  component = fixture.componentInstance;
  fixture.detectChanges();
  });

  it('should create the form with default values', () => {
    expect(component.technologyForm).toBeTruthy();
    expect(component.technologyForm.get('published')!.value).toBeTrue();
  });

  it('should close dialog with form value on save', () => {
    component.technologyForm.patchValue({ name: 'Test' });
    component.onSave();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(jasmine.objectContaining({
      technology: jasmine.objectContaining({ name: 'Test' })
    }));
  });

  it('should close dialog without value on cancel', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });

  it('should add/remove validators based on published toggle', () => {
    const classification = component.technologyForm.get('classification')!;
    const classDescription = component.technologyForm.get('classificationDescription')!;

    component.technologyForm.get('published')!.setValue(true);
    expect(classification.hasValidator(Validators.required)).toBeTrue();
    expect(classDescription.hasValidator(Validators.required)).toBeTrue();

    component.technologyForm.get('published')!.setValue(false);
    expect(classification.validator).toBeNull();
    expect(classDescription.validator).toBeNull();
  });
});
