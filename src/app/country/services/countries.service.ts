import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map, tap, combineLatest } from 'rxjs';
import { Country, SmallCountry, ValidRegion } from '../interfaces/country';


@Injectable({providedIn: 'root'})

export class CountriesService {

  private _regions: ValidRegion[] = [ 
    ValidRegion.Africa, 
    ValidRegion.Americas, 
    ValidRegion.Asia, 
    ValidRegion.Europe, 
    ValidRegion.Oceania
  ];

  private endPoint:string = 'https://restcountries.com/v3.1';

  constructor(
    private http: HttpClient
  ) {}

  get regions():ValidRegion[] {
    return [...this._regions];
  }
  
  public getByRegion( region: ValidRegion): Observable<SmallCountry[]> {
    if ( !region ) return of([]);
    const url = `${this.endPoint}/region/${region}?fields=cca3,name,borders`;
    return this.http.get<Country[]>( url )
    .pipe(
      map( countries => countries.map( country => ({
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders || []
      }))),
      tap( response => console.log( response ) ),
      catchError( () => of([]))
    );
  }

  public getByAlphaCode( alphaCode: String): Observable<SmallCountry> {
    if ( !alphaCode ) return of();
    const url = `${this.endPoint}/alpha/${alphaCode}?fields=cca3,name,borders`;
    return this.http.get<Country>( url )
    .pipe(
      map( countries => ({
          name: countries.name.common,
          cca3: countries.cca3,
          borders: countries.borders
        })
      ),
      catchError( () => of())
    );
  } 
  
  public getBordersByAlphaCode(borders: string[]):Observable<SmallCountry[]> {
    if ( !borders.length ) return of([]);
    const request:Observable<SmallCountry>[] = [];
    borders.forEach( alphaCode => {
      request.push( this.getByAlphaCode(alphaCode) );
    });

    return combineLatest( request );
  }

}
