import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interface';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

const GIFS_KEY = 'gifs';

const loadFromLocalStorage = () => {
  const data = localStorage.getItem(GIFS_KEY) ?? '{}';
  return JSON.parse( data );
}

@Injectable({providedIn: 'root'})
export class GifService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  searchHistory = signal<Record<string, Gif[]>>( loadFromLocalStorage() );

  searchHistoryKeys = computed( () => Object.keys( this.searchHistory() ) );


  constructor() {
    this.loadTrandingGifs();

    console.log('GifService initialized');
    console.log('Search history keys:', this.searchHistoryKeys());
  }

  saveGifsToLocalStorage = effect( () => {
    const history = this.searchHistory();
    localStorage.setItem(GIFS_KEY, JSON.stringify( history ));
  } );

  loadTrandingGifs(){
    this.http.get<GiphyResponse>(`${environment.giphyURL}/gifs/trending`,{
      params: {
        api_key: environment.giphyApiKey,
        limit: '20',
      }
    }).subscribe( (resp) => {
      const gifs = GifMapper.mapGiphyItemsToGifsArray( resp.data );
      console.log({ gifs });
      this.trendingGifs.set( gifs );
      this.trendingGifsLoading.set( false );

    });
  }

  searchGifs(query: string): Observable<Gif[]> | undefined {
    const trimmedQuery = query.trim().toLowerCase();
    if ( trimmedQuery.length === 0 ) return;

    return this.http.get<GiphyResponse>(`${environment.giphyURL}/gifs/search`,{
      params: {
        api_key: environment.giphyApiKey,
        q: trimmedQuery,
        limit: '20',
      }
    }).pipe(
      map(resp => GifMapper.mapGiphyItemsToGifsArray( resp.data )),
      tap( (gifs) => {
        this.searchHistory.update(  (history) => ({
          ...history,
          [trimmedQuery.toLowerCase()]: gifs,
        }) );
      })
    );
  }

  getHistoryByGif(query: string): Gif[] | [] {
    const trimmedQuery = query.trim().toLowerCase();
    return this.searchHistory()[trimmedQuery] || [];
  }

}
