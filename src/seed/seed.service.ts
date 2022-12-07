import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interface/pokemon-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly httl: AxiosAdapter,
  ) {}

  async executeSeed() {
    const data = await this.httl.get<PokeResponse>(
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
