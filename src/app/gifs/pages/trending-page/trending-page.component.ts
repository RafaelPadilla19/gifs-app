import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { GifsListComponent } from "../../components/gifs-list/gifs-list.component";
import { GifService } from '../../services/gifs.service';
import { ScrollStateService } from 'src/app/shared/scroll-state.service';

@Component({
  selector: 'app-trending-page',
  // imports: [GifsListComponent],
  templateUrl: './trending-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TrendingPageComponent implements AfterViewInit{


  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;

    if (!scrollDiv) return;

    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();

  }
  gifsService = inject(GifService);
  scrollStateService = inject(ScrollStateService);

  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  onScroll($event: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;

    if (!scrollDiv) return;

    const scrollTop = scrollDiv.scrollTop;
    const scrollHeight = scrollDiv.scrollHeight;
    const clientHeight = scrollDiv.clientHeight;
    // console.log({ scrollTop, scrollHeight, clientHeight });
    this.scrollStateService.trendingScrollState.set(scrollTop);

    debugger;

    const isABottom = scrollTop + clientHeight + 300 >= scrollHeight;

    if (isABottom) {
      this.gifsService.loadTrandingGifs();
    }
  }
}
