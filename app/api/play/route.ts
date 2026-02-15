import { NextResponse } from "next/server";
import { choosePlayType } from "@/lib/choosePlay";

const imageMap = {
  pass: {
    screen: "Pass_Short_Middle.png",
    slant: "Pass_Short_Left.png",
    go: "Pass_Deep_Middle.png",
    post: "Pass_Deep_Left.png",
    corner: "Pass_Deep_Right.png",
    out: "Pass_Short_Right.png"
  },
  run: {
    left_end: "Run_Left_End.png",
    left_tackle: "Run_Left_Tackle.png",
    left_guard: "Run_Left_Guard.png",
    middle: "Run_Center.png",
    right_guard: "Run_Right_Guard.png",
    right_tackle: "Run_Right_Tackle.png",
    right_end: "Run_Right_End.png"
  }
};

export async function POST(req: Request) {
  const { down, distance, quarter } = await req.json();

  const playType = choosePlayType(down, distance, quarter);

  const options =
    playType === "pass"
      ? Object.keys(imageMap.pass)
      : Object.keys(imageMap.run);

  const selection =
    options[Math.floor(Math.random() * options.length)];

  const image =
    playType === "pass"
      ? imageMap.pass[selection as keyof typeof imageMap.pass]
      : imageMap.run[selection as keyof typeof imageMap.run];

  return NextResponse.json({
    playType,
    image: `/images/${image}`
  });
}
