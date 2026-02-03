import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "favoritos";

export async function getFavorites() {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export async function isFavorite(pokemon: any) {
  const favs = await getFavorites();
  return favs.some((p: any) => p.name === pokemon.name);
}

export async function toggleFavorite(pokemon: any) {
  const favs = await getFavorites();
  const exists = favs.some((p: any) => p.name === pokemon.name);

  let newFavs;
  if (exists) {
    newFavs = favs.filter((p: any) => p.name !== pokemon.name);
  } else {
    newFavs = [...favs, pokemon];
  }

  await AsyncStorage.setItem(KEY, JSON.stringify(newFavs));
  return !exists;
}
