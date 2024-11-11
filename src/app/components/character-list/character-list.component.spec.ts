/// <reference lib="dom" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterListComponent } from './character-list.component';
import { ApiService } from '../../services/api.service';
import { of, throwError } from 'rxjs';
import { Character } from '../../models/character.interface';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CharacterListComponent', () => {
  let component: CharacterListComponent;
  let fixture: ComponentFixture<CharacterListComponent>;
  let apiService: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterListComponent],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ApiService],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterListComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadCharacters on ngOnInit', () => {
    const loadCharactersSpy = jest.spyOn(component, 'loadCharacters');
    component.ngOnInit();

    fixture.detectChanges();

    const req = httpMock.expectOne('https://swapi.dev/api/people/?page=1');
    req.flush({ results: [] });

    httpMock.verify();

    expect(loadCharactersSpy).toHaveBeenCalled();
  });

  describe('loadCharacters', () => {
    it('should load characters successfully and update the character list', () => {
      const mockCharacters = {
        results: [
          { name: 'Luke Skywalker', gender: 'male', url: '/characters/1', height: '172', mass: '77', hair_color: 'blond', eye_color: 'blue', birth_year: '19BBY', homeworld: 'Tatooine', film: ['A New Hope'], species: ['Human'], vehicles: ['Speeder'], starships: ['X-Wing'], skin_color: 'fair', isFavorite: false, created: '2021-01-01', edited: '2021-01-01' },
          { name: 'Leia Organa', gender: 'female', url: '/characters/2', height: '150', mass: '49', hair_color: 'brown', eye_color: 'brown', birth_year: '19BBY', homeworld: 'Alderaan', film: ['A New Hope'], species: ['Human'], vehicles: [], starships: ['Rebel Transport'], skin_color: 'light', isFavorite: false, created: '2021-01-01', edited: '2021-01-01' }
        ]
      };

      jest.spyOn(apiService, 'getCharacters').mockReturnValue(of(mockCharacters));

      fixture.detectChanges();
      expect(component.characters.length).toBe(2);
      expect(component.filteredCharacters.length).toBe(2);
      expect(component.loading).toBe(false);
      expect(component.errorMessage).toBeNull();
    });

    it('should handle error while loading characters', () => {
      jest.spyOn(apiService, 'getCharacters').mockReturnValue(throwError('Failed to load characters'));

      component.loadCharacters();

      fixture.detectChanges();

      expect(component.errorMessage).toBe('Failed to load characters. Please try again later.');
      expect(component.loading).toBe(false);
    });
  });

  describe('onGenderFilterChange', () => {
    it('should filter characters by selected gender', () => {
      component.characters = [
        { name: 'Luke Skywalker', gender: 'male', url: '/characters/1', height: '172', mass: '77', hair_color: 'blond', eye_color: 'blue', birth_year: '19BBY', homeworld: 'Tatooine', film: ['A New Hope'], species: ['Human'], vehicles: ['Speeder'], starships: ['X-Wing'], skin_color: 'fair', isFavorite: false, created: '2021-01-01', edited: '2021-01-01' },
        { name: 'Leia Organa', gender: 'female', url: '/characters/2', height: '150', mass: '49', hair_color: 'brown', eye_color: 'brown', birth_year: '19BBY', homeworld: 'Alderaan', film: ['A New Hope'], species: ['Human'], vehicles: [], starships: ['Rebel Transport'], skin_color: 'light', isFavorite: false, created: '2021-01-01', edited: '2021-01-01' }
      ];

      component.onGenderFilterChange({ target: { value: 'male' } } as any);

      expect(component.selectedGender).toBe('male');
      expect(component.filteredCharacters.length).toBe(1);
      expect(component.filteredCharacters[0].gender).toBe('male');
    });

    it('should show all characters when "all" is selected', () => {
      component.characters = [
        { name: 'Luke Skywalker', gender: 'male', url: '/characters/1', height: '172', mass: '77', hair_color: 'blond', eye_color: 'blue', birth_year: '19BBY', homeworld: 'Tatooine', film: ['A New Hope'], species: ['Human'], vehicles: ['Speeder'], starships: ['X-Wing'], skin_color: 'fair', isFavorite: false, created: '2021-01-01', edited: '2021-01-01' },
        { name: 'Leia Organa', gender: 'female', url: '/characters/2', height: '150', mass: '49', hair_color: 'brown', eye_color: 'brown', birth_year: '19BBY', homeworld: 'Alderaan', film: ['A New Hope'], species: ['Human'], vehicles: [], starships: ['Rebel Transport'], skin_color: 'light', isFavorite: false, created: '2021-01-01', edited: '2021-01-01' }
      ];

      component.onGenderFilterChange({ target: { value: 'all' } } as any);

      expect(component.selectedGender).toBe('all');
      expect(component.filteredCharacters.length).toBe(2);
    });
  });

  describe('onScroll', () => {
    it('should load more characters when scrolling near the bottom and no other load is in progress', () => {
      const mockCharacters = { results: [{ name: 'Luke Skywalker', gender: 'male', url: '/characters/1' }] };
      jest.spyOn(apiService, 'getCharacters').mockReturnValue(of(mockCharacters));

      component.currentPage = 1;
      component.characters = [];
      fixture.detectChanges();

      const scrollEvent = { target: { scrollHeight: 1000, scrollTop: 950, clientHeight: 100 } };

      const loadCharactersSpy = jest.spyOn(component, 'loadCharacters');

      component.onScroll(scrollEvent as any);

      fixture.detectChanges();

      expect(loadCharactersSpy).toHaveBeenCalled();
      expect(component.currentPage).toBe(2);
      expect(component.characters.length).toBe(2);
    });

    it('should not load more characters if already loading', () => {
      component.loading = true;

      const scrollEvent = { target: { scrollHeight: 1000, scrollTop: 950, clientHeight: 100 } };

      const loadCharactersSpy = jest.spyOn(component, 'loadCharacters');

      component.onScroll(scrollEvent as any);

      expect(loadCharactersSpy).not.toHaveBeenCalled();
    });
  });


  describe('toggleFavorite', () => {
    it('should toggle the favorite status of a character', () => {
      const mockCharacter: Character = { name: 'Luke Skywalker', gender: 'male', url: '/characters/1', height: '172', mass: '77', hair_color: 'blond', eye_color: 'blue', birth_year: '19BBY', homeworld: 'Tatooine', film: ['A New Hope'], species: ['Human'], vehicles: ['Speeder'], starships: ['X-Wing'], skin_color: 'fair', isFavorite: false, created: '2021-01-01', edited: '2021-01-01' };
      component.characters = [mockCharacter];

      const event = new MouseEvent('click');
      component.toggleFavorite(event, mockCharacter);

      expect(mockCharacter.isFavorite).toBe(true); // It should be toggled to true

      component.toggleFavorite(event, mockCharacter);
      expect(mockCharacter.isFavorite).toBe(false); // It should be toggled back to false
    });
  });

  describe('loadCharacters', () => {
    it('should handle the case when no characters are returned from the API', () => {
      jest.spyOn(apiService, 'getCharacters').mockReturnValue(of({ results: [] }));

      component.loadCharacters();
      fixture.detectChanges();

      expect(component.characters.length).toBe(0); // Should be empty if no characters are returned
      expect(component.filteredCharacters.length).toBe(0); // Should also be empty
    });

    it('should handle pagination beyond available data', () => {
      jest.spyOn(apiService, 'getCharacters').mockReturnValue(of({ results: [] }));

      component.currentPage = 10;  // Assuming page 10 doesn't exist
      component.loadCharacters();

      fixture.detectChanges();
      expect(component.loading).toBe(false); // Should not cause infinite loading
    });
  });

  it('should initialize with all characters in filteredCharacters', () => {
    const mockCharacters = {
      results: [
        { name: 'Luke Skywalker', gender: 'male', url: '/characters/1' },
        { name: 'Leia Organa', gender: 'female', url: '/characters/2' }
      ]
    };
    jest.spyOn(apiService, 'getCharacters').mockReturnValue(of(mockCharacters));

    fixture.detectChanges();

    expect(component.filteredCharacters.length).toBe(2); // All characters should be present initially
    expect(component.filteredCharacters[0].name).toBe('Luke Skywalker');
    expect(component.filteredCharacters[1].name).toBe('Leia Organa');
  });

});
