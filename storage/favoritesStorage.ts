import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "FAVORITE_POKEMONS";

export async function getFavorites() {
  const json = await AsyncStorage.getItem(KEY);
  return json ? JSON.parse(json) : [];
}

export async function addFavorite(name: string) {
  const current = await getFavorites();
  if (!current.includes(name)) {
    const updated = [...current, name];
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  }
}

export async function removeFavorite(name: string) {
  const current = await getFavorites();
  const updated = current.filter((n: string) => n !== name);
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}

export async function isFavorite(name: string) {
  const current = await getFavorites();
  return current.includes(name);
}
