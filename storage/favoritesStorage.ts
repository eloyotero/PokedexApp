import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@pokedex:favorites";

export const getFavorites = async (): Promise<string[]> => {
  try {
    const json = await AsyncStorage.getItem(KEY);
    return json ? (JSON.parse(json) as string[]) : [];
  } catch {
    return [];
  }
};

export const addFavorite = async (name: string): Promise<void> => {
  const list = await getFavorites();
  if (!list.includes(name)) {
    list.push(name);
    await AsyncStorage.setItem(KEY, JSON.stringify(list));
  }
};

export const removeFavorite = async (name: string): Promise<void> => {
  const list = (await getFavorites()).filter((n) => n !== name);
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
};
