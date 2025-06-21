import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSubject = new BehaviorSubject<string>('');
  public searchTerm$ = this.searchTermSubject.asObservable();

  constructor() { }

  setSearchTerm(term: string) {
    console.log('SearchService: Setting search term:', term);
    this.searchTermSubject.next(term);
  }

  getSearchTerm(): string {
    const term = this.searchTermSubject.value;
    console.log('SearchService: Getting search term:', term);
    return term;
  }
} 