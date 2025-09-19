import { Injectable } from '@angular/core';
import {Technology} from '../../../models/technology.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechItemService {

  constructor(private http: HttpClient) {
  }

  getTechItems(): Observable<Technology[]> {
    return this.http.get<Technology[]>('/api/technology');
  }

  addTechItem(techItem: Technology): Observable<Technology> {
    return this.http.post<Technology>('/api/technology', techItem);
  }

  deleteTechItem(techItemId: string) {
    console.log(`Delete TechItem ${techItemId}`);
    this.http.delete(`/api/technology/${techItemId}`).subscribe();
  }

  updateTechItem(techItem: Technology): Observable<Technology> {
    console.log(`TEEEESSST ${techItem._id}`);

    const testi = {
      name: techItem.name,
      category: techItem.category,
      classification: techItem.classification,
      technologyDescription: techItem.technologyDescription,
      classificationDescription: techItem.classificationDescription,
      published: techItem.published,
    }
    return this.http.put<Technology>(`/api/technology/${techItem._id}`, testi);
  }
}
