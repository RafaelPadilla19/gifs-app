import { Gif } from "../interfaces/gif.interface";
import { GifphyItem } from "../interfaces/giphy.interface";

export class GifMapper {
  static mapGiphyItemToGif( giphyData: GifphyItem ): Gif {
    return {
      id: giphyData.id,
      title: giphyData.title,
      url: giphyData.images.original.url,
    }
  }

  static mapGiphyItemsToGifsArray( giphyItems: GifphyItem[] ): Gif[] {
    return giphyItems.map( this.mapGiphyItemToGif );
  }
}
