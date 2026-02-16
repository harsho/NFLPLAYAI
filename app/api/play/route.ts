import { NextResponse } from "next/server";
import playbookData from "@/lib/offensive_playbook_success.json";

const imageMap: { [key: string]: string } = {
  pass_short_middle: "Pass_Short_Middle.png",
  pass_short_left: "Pass_Short_Left.png",
  pass_short_right: "Pass_Short_Right.png",
  pass_deep_middle: "Pass_Deep_Middle.png",
  pass_deep_left: "Pass_Deep_Left.png",
  pass_deep_right: "Pass_Deep_Right.png",
  run_left_end: "Run_Left_End.png",
  run_left_tackle: "Run_Left_Tackle.png",
  run_left_guard: "Run_Left_Guard.png",
  run_center: "Run_Center.png",
  run_right_guard: "Run_Right_Guard.png",
  run_right_tackle: "Run_Right_Tackle.png",
  run_right_end: "Run_Right_End.png"
};

interface Play {
  play_id: string;
  play_type: string;
  play_concept: string;
  success_prob: number;
}

interface PlaybookEntry {
  down: number;
  distance: number;
  yardline: number;
  formation: string;
  plays: Play[];
}

export async function POST(req: Request) {
  const { down, distance, yardline_100, quarter, offense_formation } = await req.json();

  console.log("Request params:", {
    down,
    distance,
    yardline_100,
    offense_formation,
    quarter
  });

  // Find matching play scenario in the playbook
  const playScenario = (playbookData as PlaybookEntry[]).find(
    (entry) =>
      entry.down === down &&
      entry.distance === distance &&
      entry.yardline === yardline_100 &&
      entry.formation === offense_formation
  );

  console.log("Found scenario:", playScenario ? "yes" : "no");

  if (!playScenario || playScenario.plays.length === 0) {
    // Debug: show available scenarios
    const availableScenarios = (playbookData as PlaybookEntry[])
      .filter((entry) => entry.down === down && entry.distance === distance)
      .map((e) => ({ yardline: e.yardline, formation: e.formation }));

    console.log("Available scenarios for down/distance:", availableScenarios);

    return NextResponse.json(
      {
        error: "No plays found for this scenario",
        params: { down, distance, yardline_100, offense_formation },
        availableScenarios
      },
      { status: 404 }
    );
  }

  // Select play based on weighted success probabilities
  const totalProb = playScenario.plays.reduce(
    (sum, play) => sum + play.success_prob,
    0
  );
  let random = Math.random() * totalProb;
  let selectedPlay = playScenario.plays[0];

  for (const play of playScenario.plays) {
    random -= play.success_prob;
    if (random <= 0) {
      selectedPlay = play;
      break;
    }
  }

  const image = imageMap[selectedPlay.play_id];

  return NextResponse.json({
    playId: selectedPlay.play_id,
    playType: selectedPlay.play_type,
    playConcept: selectedPlay.play_concept,
    successProb: selectedPlay.success_prob,
    image: `/images/${image || "placeholder.png"}`
  });
}
