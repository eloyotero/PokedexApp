const BASE_URL = "https://pokeapi.co/api/v2";

export async function getMove(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error al obtener el ataque");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
