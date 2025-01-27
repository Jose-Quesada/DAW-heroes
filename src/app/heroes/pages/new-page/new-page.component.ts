import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.inteface';
import { HeroesService } from '../../heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit{

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics'},
    { id: 'Marvel Comics', desc: 'Marvel - Comics'}
  ]

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters: new FormControl<string>(''),
    alt_img: new FormControl<string>(''),
  });
  snackbar: any;

  constructor(
    private heroesService:HeroesService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private matSnackBar:MatSnackBar,
    private dialog:MatDialog){}


    ngOnInit(): void {
      if (!this.router.url.includes('edit')) return;
      //Si la URL no contiene edit salgo
      this.activatedRoute.params
        .pipe(
          switchMap ( ({id}) => this.heroesService.getHeroById( id ))
          //Desectruturamos "params", solo necesitamos el "id"
        ).subscribe ( hero => {
          if ( !hero ) return this.router.navigateByUrl('/');
          //Si no viene "hero" retornamos a /
          this.heroForm.reset ( hero );
          //Si devuelve "hero" completo el formulario con los datos
          return;
        })
    }


  get currentHero(): Hero{
    const hero = this.heroForm.value as Hero;

    return hero;
  }


  onSubmit():void {

    if (this.heroForm.invalid) return;

    if ( this.currentHero.id ){
      this.heroesService.updateHero( this.currentHero )
        .subscribe ( hero =>{
          this.showSnackbar(`${hero.superhero} actualizado!`)
        } );
      return;
    }
    this.heroesService.addHero( this.currentHero )
      .subscribe( hero => {
        this.router.navigate(['/heroes/list'  ])
        this.showSnackbar(`${hero.superhero} creado!`)
      })
}

  showSnackbar ( message: string):void {
    this.matSnackBar.open ( message, 'done',{
      duration: 2500,
    })
  }

  onDeleteHero(){
    if ( !this.currentHero.id ) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {name: this.heroForm.value}
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( !result ) return;
      this.heroesService.deleteHeroById( this.currentHero.id )
      .subscribe( wasDeleted => {
        if (wasDeleted)  this.router.navigate(['/heroes'])}
       )
    });
  }







}
