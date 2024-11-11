import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://swapi.dev/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched requests are outstanding after each test
  });

  // Test for getCharacters()
  it('should fetch characters for a given page number', () => {
    const mockCharacters = { results: [{ name: 'Luke Skywalker' }, { name: 'Darth Vader' }] };
    const page = 1;

    service.getCharacters(page).subscribe((data) => {
      expect(data).toEqual(mockCharacters);
    });

    const req = httpMock.expectOne(`${baseUrl}/people/?page=${page}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCharacters); // Simulate a response
  });

  it('should handle empty character list', () => {
    const mockCharacters = { results: [] };
    const page = 1;

    service.getCharacters(page).subscribe((data) => {
      expect(data.results.length).toBe(0); // Should be an empty list
    });

    const req = httpMock.expectOne(`${baseUrl}/people/?page=${page}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCharacters); // Simulate an empty response
  });

  it('should handle invalid page number', () => {
    const page = -1; // Invalid page number
    const mockCharacters = { results: [] };

    service.getCharacters(page).subscribe((data) => {
      expect(data.results).toBeDefined();
      expect(data.results.length).toBe(0); // Should handle invalid page gracefully
    });

    const req = httpMock.expectOne(`${baseUrl}/people/?page=${page}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCharacters); // Simulate the response
  });

  // Test for getCharacterDetail()
  it('should fetch character details by ID', () => {
    const characterId = 1;
    const mockCharacter = { name: 'Luke Skywalker', height: '172', mass: '77' };

    service.getCharacterDetail(characterId).subscribe((data) => {
      expect(data).toEqual(mockCharacter);
    });

    const req = httpMock.expectOne(`${baseUrl}/people/${characterId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCharacter); // Simulate a response
  });

  it('should handle character not found (404)', () => {
    const characterId = 999; // Assuming this ID does not exist
    const errorResponse = { status: 404, statusText: 'Not Found' };

    service.getCharacterDetail(characterId).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error) => {
        expect(error.status).toBe(404); // Assert the correct status
        expect(error.statusText).toBe('Not Found');
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/people/${characterId}`);
    expect(req.request.method).toBe('GET');
    req.flush(null, errorResponse); // Simulate a 404 error response
  });

  it('should handle network error', () => {
    const characterId = 1;
    const errorResponse = { status: 0, statusText: 'Unknown Error' };

    service.getCharacterDetail(characterId).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error) => {
        expect(error.status).toBe(0); // Network error typically has a 0 status
        expect(error.statusText).toBe('Unknown Error');
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/people/${characterId}`);
    expect(req.request.method).toBe('GET');
    req.flush(null, errorResponse); // Simulate a network error
  });

  // Test for getFilmDetail()
  it('should fetch film details by URL', () => {
    const filmUrl = 'https://swapi.dev/api/films/1/';
    const mockFilm = { title: 'A New Hope', episode_id: 4 };

    service.getFilmDetail(filmUrl).subscribe((data) => {
      expect(data).toEqual(mockFilm);
    });

    const req = httpMock.expectOne(filmUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockFilm); // Simulate a response
  });

  it('should handle network error when fetching film details', () => {
    const filmUrl = 'https://swapi.dev/api/films/1/';
    const errorResponse = { status: 0, statusText: 'Unknown Error' };

    service.getFilmDetail(filmUrl).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error) => {
        expect(error.status).toBe(0); // Network error
        expect(error.statusText).toBe('Unknown Error');
      }
    });

    const req = httpMock.expectOne(filmUrl);
    expect(req.request.method).toBe('GET');
    req.flush(null, errorResponse); // Simulate network error
  });
});
