const BASE_URL = "https://pokeapi.co/api/v2";

export async function getPokemons(limit: number = 50, offset: number = 0) {
  try {
    const response = await fetch(
      `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    );
    if (!response.ok) {
      throw new Error("Error al obtener los Pokémon");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getPokemonDetail(name: string) {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${name}`);
    if (!response.ok) {
      throw new Error("Error al obtener el detalle del Pokémon");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
