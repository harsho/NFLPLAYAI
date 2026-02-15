import probability from "./probability.json";

function bucketDistance(distance: number) {
  if (distance <= 2) return "short";
  if (distance <= 6) return "medium";
  return "long";
}

export function choosePlayType(
  down: number,
  distance: number,
  quarter: number
) {
  const bucket = bucketDistance(distance);
  const key = `${down}_${bucket}_${quarter}`;

  const probs = (probability as any)[key];

  if (!probs) return "pass";

  const rand = Math.random();
  return rand < probs.pass ? "pass" : "run";
}
