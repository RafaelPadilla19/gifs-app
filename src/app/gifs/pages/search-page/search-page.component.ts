import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GifsListComponent } from "../../components/gifs-list/gifs-list.component";
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifsListComponent],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SearchPageComponent {

  gifsService = inject(GifService);

  gifs = signal<Gif[]>([]);

  onSearch(query: string): void {
    this.gifsService.searchGifs(query)?.subscribe( (resp) => {
      this.gifs.set( resp );

    });
  }
}
