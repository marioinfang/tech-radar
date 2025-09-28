import { TestBed } from '@angular/core/testing';
import { TechnologyService } from './technology.service';
import {Technology} from '../../models/technology.model';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {UpdateTechnologyDto} from '../../models/update-technology-dto.model';

describe('TechnologyService', () => {
  let service: TechnologyService;
  let httpTestingController: HttpTestingController;
  const baseUrl = '/api/technology';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TechnologyService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TechnologyService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should send a GET request to /api/technology for getTechnologies()', () => {
    const mockTechnologies: Technology[] = [];

    service.getTechnologies().subscribe(technologies => {
      expect(technologies).toEqual(mockTechnologies);
    });

    const req = httpTestingController.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);

    req.flush(mockTechnologies);
  });

  it('should send a GET request with published=true query parameter', () => {
    const mockTechnologies: Technology[] = [];

    service.getPublishedTechnologies().subscribe(technologies => {
      expect(technologies).toEqual(mockTechnologies);
    });

    const req = httpTestingController.expectOne(request =>
      request.url === baseUrl && request.params.get('published') === 'true'
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.params.toString()).toContain('published=true');
    req.flush(mockTechnologies);
  });

  it('should send a POST request with the new technology object', () => {
    const newTech: Technology = { id: '', name: 'Test', category: 'Tools', classification: 'Hold', technologyDescription: 'D', classificationDescription: 'C', published: true };

    service.createTechnology(newTech).subscribe(tech => {
      expect(tech).toEqual(newTech);
    });

    const req = httpTestingController.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTech);
    req.flush(newTech);
  });

  it('should send a PUT request to the specific ID with DTO body', () => {
    const techId = 'abc-123';
    const dto: UpdateTechnologyDto = { name: 'Test', category: 'Tools', classification: 'Hold', technologyDescription: 'D', classificationDescription: 'C', published: false };


    service.updateTechnology(techId, dto).subscribe();

    const expectedUrl = `${baseUrl}/${techId}`;
    const req = httpTestingController.expectOne(expectedUrl);

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(dto);
    req.flush({});
  });

  it('should send a DELETE request to the specific ID', () => {
    const techId = 'xyz-456';

    service.deleteTechnology(techId).subscribe();

    const expectedUrl = `${baseUrl}/${techId}`;
    const req = httpTestingController.expectOne(expectedUrl);

    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
