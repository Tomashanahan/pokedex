import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interface/pokemon-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(private readonly pokemonService: PokemonService) {}

  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const pokemons: { name: string; no: number }[] = [];
    data.results.forEach(({ name, url }) => {
      const urlSegments = url.split('/');
      const no = +urlSegments[urlSegments.length - 2];
      pokemons.push({ name, no });
    });

    this.pokemonService.implementSeed(pokemons);
    return 'seed run correctly';
  }
}
