/// <reference lib="dom" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterDetailComponent } from './character-detail.component';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';
import { Character } from '../../models/character.interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('CharacterDetailComponent', () => {
  let component: CharacterDetailComponent;
  let fixture: ComponentFixture<CharacterDetailComponent>;
  let apiService: ApiService;
  let location: Location;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterDetailComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        ApiService,
        Location,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => '1' } } // Simulate route parameter `id = 1`
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterDetailComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    location = TestBed.inject(Location);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadCharacter on ngOnInit', () => {
    const loadCharacterSpy = jest.spyOn(component, 'loadCharacter');
    component.ngOnInit();

    fixture.detectChanges();

    expect(loadCharacterSpy).toHaveBeenCalled();
  });

  describe('loadCharacter', () => {
    it('should load character details successfully', () => {
      const mockCharacter: Character = {
        name: 'Luke Skywalker',
        gender: 'male',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        eye_color: 'blue',
        birth_year: '19BBY',
        homeworld: 'Tatooine',
        film: ['A New Hope'],
        species: ['Human'],
        vehicles: ['Speeder'],
        starships: ['X-Wing'],
        skin_color: 'fair',
        isFavorite: false,
        created: '2021-01-01',
        edited: '2021-01-01',
        url: '/characters/1'
      };

      jest.spyOn(apiService, 'getCharacterDetail').mockReturnValue(of(mockCharacter));

      component.loadCharacter();

      fixture.detectChanges();

      expect(component.character).toEqual(mockCharacter);
      expect(component.errorMessage).toBeUndefined();
    });

    it('should handle missing character ID in the route', () => {
      // Override route parameter to simulate missing ID
      activatedRoute.snapshot.paramMap.get = jest.fn(() => null);

      component.loadCharacter();

      fixture.detectChanges();

      expect(component.errorMessage).toBe('Character ID is missing in the route parameters');
    });

    it('should handle invalid character ID in the route', () => {
      // Override route parameter to simulate invalid ID
      activatedRoute.snapshot.paramMap.get = jest.fn(() => 'invalid');

      component.loadCharacter();

      fixture.detectChanges();

      expect(component.errorMessage).toBe('Invalid character ID');
    });

    it('should handle API error and set error message', () => {
      jest.spyOn(apiService, 'getCharacterDetail').mockReturnValue(throwError({ message: 'API Error' }));

      component.loadCharacter();

      fixture.detectChanges();

      expect(component.errorMessage).toBe('Failed to load character details: API Error');
    });

    it('should handle case when character is not found', () => {
      jest.spyOn(apiService, 'getCharacterDetail').mockReturnValue(of(null));

      component.loadCharacter();

      fixture.detectChanges();

      expect(component.errorMessage).toBe('Character not found');
    });
  });

  describe('goBack', () => {
    it('should navigate back using Location service', () => {
      const goBackSpy = jest.spyOn(location, 'back');
      component.goBack();

      expect(goBackSpy).toHaveBeenCalled();
    });
  });
});
