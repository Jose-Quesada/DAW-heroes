import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.inteface';

@Pipe({
  name: 'heroImage'
})
export class HeroImagePipe implements PipeTransform {

  transform(hero:Hero): string {
    if (!hero.id && !hero.alt_img){
      return 'no_image.jpg';
    }
    if (hero.alt_img) return hero.alt_img;

    return `heroes/${hero.id}.jpg`;

  }

}
