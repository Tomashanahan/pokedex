import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async implementSeed(pokemons: CreatePokemonDto[]) {
    try {
      await this.pokemonModel.deleteMany(); // to delete all in the db to prevent duplcates
      const pokemon = await this.pokemonModel.insertMany(pokemons);
      return pokemon;
    } catch (error) {
      this.handleExeption(error);
    }
  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExeption(error);
    }
  }

  private handleExeption(error) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exist in the database ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `Pokemon doesn't exist in the database`,
    );
  }

  findAll() {
    return this.pokemonModel.find();
  }

  async findOne(term: string) {
    try {
      if (isNaN(Number(term))) {
        const pokemon = await this.pokemonModel.findById(term);
        if (pokemon) {
          return pokemon;
        } else {
          throw new Error();
        }
      } else {
        const pokemon = await this.pokemonModel.findOne({ no: term });
        if (pokemon) {
          return pokemon;
        } else {
          throw new Error();
        }
      }
    } catch (error) {
      throw new BadRequestException(
        `Pokemon ${term} doesn't exist in the database`,
      );
    }
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    try {
      await pokemon.updateOne(updatePokemonDto);

      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExeption(error);
    }
  }

  async remove(id: string) {
    try {
      const pokemon = await this.pokemonModel.deleteOne({ _id: id });
      if (pokemon.deletedCount > 0) {
        return pokemon;
      } else {
        throw new Error();
      }
    } catch (error) {
      throw new BadRequestException(
        `Pokemon ${id} doesn't exist in the database`,
      );
    }
  }
}
