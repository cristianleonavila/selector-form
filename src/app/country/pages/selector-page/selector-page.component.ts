import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { SmallCountry, ValidRegion } from '../../interfaces/country';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})

export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = []; 

  public currentBorders: SmallCountry[] = [];

  public selectorForm: FormGroup = this.frmBuilder.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    borders: ['', Validators.required],
  });
  
  constructor(
    private frmBuilder: FormBuilder,
    private countryServ: CountriesService ) {
  }

  get hasCountriesByRegion() {
    return this.countriesByRegion.length > 0;
  }

  get hasCurrentBorders() {
    return this.currentBorders.length > 0;
  }  

  get regions():ValidRegion[] {
    return this.countryServ.regions;
  }

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  private onRegionChanged():void {
    this.selectorForm.get('region')!.valueChanges.pipe(
      tap( () => this.selectorForm.get('country')?.setValue('') ),
      tap( () => this.currentBorders = []),
      switchMap( region => this.countryServ.getByRegion(region) )
    ).subscribe( countries => this.countriesByRegion = countries);
  }

  private onCountryChanged():void {
    this.selectorForm.get('country')!.valueChanges.pipe(
      tap( () => this.selectorForm.get('borders')?.setValue('') ),
      switchMap( alphaCode => this.countryServ.getByAlphaCode(alphaCode) ),
      switchMap( (country:SmallCountry) => this.countryServ.getBordersByAlphaCode( country.borders ) )
    ).subscribe( countries => this.currentBorders = countries)
  }  

}
