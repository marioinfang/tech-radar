import { Injectable } from '@angular/core';
import {Technology} from '../../models/technology.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UpdateTechnologyDto} from '../../models/update-technology-dto.model';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

  constructor(private http: HttpClient) {
  }

  getTechnologies(): Observable<Technology[]> {
    return this.http.get<Technology[]>('/api/technology');
  }

  createTechnology(technology: Technology): Observable<Technology> {
    return this.http.post<Technology>('/api/technology', technology);
  }

  deleteTechnology(technologyId: string): Observable<any> {
    console.log(`Delete TechItem ${technologyId}`);
    return this.http.delete(`/api/technology/${technologyId}`);
  }

  updateTechnology(id: string, dto: UpdateTechnologyDto): Observable<Technology> {
    return this.http.put<Technology>(`/api/technology/${id}`, dto);
  }
}
