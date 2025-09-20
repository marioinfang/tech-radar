import {Technology} from './technology.model';

export interface UpdateTechnologyDto {
  name: string;
  category: string;
  classification?: string;
  technologyDescription: string;
  classificationDescription?: string;
  published: boolean;
}

export class TechnologyMapper {
  static toUpdateDto(tech: Technology): UpdateTechnologyDto {
    return {
      name: tech.name,
      category: tech.category,
      classification: tech.classification,
      technologyDescription: tech.technologyDescription,
      classificationDescription: tech.classificationDescription,
      published: tech.published
    };
  }
}
