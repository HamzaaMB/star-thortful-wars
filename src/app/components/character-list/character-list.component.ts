import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Character } from 'src/app/models/character.interface';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {
  characters: Character[] = [];
  filteredCharacters: Character[] = [];
  currentPage: number = 1;
  selectedGender: string = 'all';
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    if (this.loading) return;
  
    this.loading = true;
    this.errorMessage = null;
  
    this.apiService.getCharacters(this.currentPage).subscribe({
      next: (data) => {
        const newCharacters = data.results;
  
        this.characters = [
          ...this.characters,
          ...newCharacters.map((character: Character) => ({ ...character, isFavorite: false }))
        ];
  
        this.filterCharacters();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load characters. Please try again later.';
        this.loading = false;
      },
      complete: () => {
        console.log('Character loading completed.');
      }
    });
  }

  onGenderFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedGender = target.value;
    this.filterCharacters();
  }

  filterCharacters(): void {
    if (this.selectedGender === 'all') {
      this.filteredCharacters = this.characters;
    } else {
      this.filteredCharacters = this.characters.filter(character =>
        character.gender === this.selectedGender
      );
    }
  }

  onScroll(event: any): void {
    const container = event.target;
    const nearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;

    if (nearBottom && !this.loading) {
      this.currentPage++;
      if (this.currentPage < 10) {
        this.loadCharacters();
      } else {
        this.loading = false;
      }
    }
  }

  toggleFavorite(event: MouseEvent, character: Character): void {
    event.stopPropagation();
    character.isFavorite = !character.isFavorite;
  }
}
