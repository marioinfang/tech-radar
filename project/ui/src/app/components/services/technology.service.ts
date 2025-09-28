import { Injectable } from '@angular/core';
import {Technology} from '../../models/technology.model.js';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UpdateTechnologyDto} from '../../models/update-technology-dto.model';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

  constructor(private http: HttpClient) {
  }

  getTechnologies(): Observable<Technology[]> {
    return this.http.get<Technology[]>('/api/technology', {withCredentials: true});
  }

  getPublishedTechnologies(): Observable<Technology[]> {
    let params = new HttpParams().set('published', 'true');
    return this.http.get<Technology[]>('/api/technology', {withCredentials: true, params: params});
  }

  createTechnology(technology: Technology): Observable<Technology> {
    return this.http.post<Technology>('/api/technology', technology);
  }

  deleteTechnology(technologyId: string): Observable<any> {
    return this.http.delete(`/api/technology/${technologyId}`);
  }

  updateTechnology(id: string, dto: UpdateTechnologyDto): Observable<Technology> {
    return this.http.put<Technology>(`/api/technology/${id}`, dto);
  }
}
