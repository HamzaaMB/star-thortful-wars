import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterMoviesComponent } from './character-movies.component';

describe('CharacterMoviesComponent', () => {
  let component: CharacterMoviesComponent;
  let fixture: ComponentFixture<CharacterMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharacterMoviesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
