import { typeChart } from "./pokemonTypes";

export function getTurnOrder(player: any, enemy: any) {
  const pSpeed = player.stats[5].base_stat;
  const eSpeed = enemy.stats[5].base_stat;
  return pSpeed >= eSpeed ? "player" : "enemy";
}

export function calculateDamage(attacker: any, defender: any, move: any) {
  const level = 50;

  const accuracy = move.accuracy ?? 100;
  const missed = Math.random() * 100 > accuracy;
  if (missed) return { damage: 0, crit: false, effectiveness: 1, missed: true };

  const crit = Math.random() < 0.1;

  const attack = attacker.stats[1].base_stat;
  const defense = defender.stats[2].base_stat;

  const moveType = move.type.name;
  const defenderTypes = defender.types.map((t: any) => t.type.name);

  let effectiveness = 1;
  defenderTypes.forEach((t: string) => {
    const eff = typeChart[moveType]?.[t] ?? 1;
    effectiveness *= eff;
  });

  const base =
    (((2 * level) / 5 + 2) * move.power * (attack / defense)) / 50 + 2;

  const damage = Math.floor(base * (crit ? 1.5 : 1) * effectiveness);

  return { damage, crit, effectiveness, missed: false };
}
