import {TechCategory} from './tech-category.enum';
import {TechClassification} from './tech-classification.enum';

export interface Technology {
  id?: string;
  name: string;
  category: TechCategory;
  classification?: TechClassification;
  technologyDescription: string;
  classificationDescription?: string;
  published: boolean;
  createDate?: Date;
  updateDate?: Date;
  publishDate?: Date;
}
