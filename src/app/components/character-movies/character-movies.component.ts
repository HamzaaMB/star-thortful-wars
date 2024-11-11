import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-character-movies',
  templateUrl: './character-movies.component.html',
  styleUrls: ['./character-movies.component.scss']
})
export class CharacterMoviesComponent implements OnInit {

  constructor() { }

  @Input() movies: string[] = [];
  
  ngOnInit(): void {
  }
}
