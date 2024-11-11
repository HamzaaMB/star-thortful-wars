import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Location } from '@angular/common';
import { Character } from '../../models/character.interface';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss']
})
export class CharacterDetailComponent implements OnInit {
  character: Character | undefined;
  errorMessage: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private location: Location
  ) { }

  loadCharacter(): void {
    const characterId = this.route.snapshot.paramMap.get('id');

    if (!characterId) {
      this.errorMessage = 'Character ID is missing in the route parameters';
      return;
    }

    const id = Number(characterId);

    if (isNaN(id)) {
      this.errorMessage = 'Invalid character ID';
      return;
    }

    this.apiService.getCharacterDetail(id)
      .pipe(
        catchError(err => {
          this.errorMessage = `Failed to load character details: ${err.message}`;
          return of(null);
        })
      )
      .subscribe(character => {
        if (character) {
          this.character = character;
          this.errorMessage = undefined;
        } else if (!this.errorMessage) {
          this.errorMessage = 'Character not found';
        }
      });
  }

  ngOnInit(): void {
    this.loadCharacter();
  }

  goBack(): void {
    this.location.back();
  }
}
