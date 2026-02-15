"use client";

import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [down, setDown] = useState(1);
  const [ydstogo, setYdstogo] = useState(10);
  const [yardline100, setYardline100] = useState(50);
  const [quarter, setQuarter] = useState(1);
  const [offenseFormation, setOffenseFormation] = useState("SHOTGUN");

  async function getPlay() {
    const res = await fetch("/api/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        down,
        distance: ydstogo,
        yardline_100: yardline100,
        quarter,
        offense_formation: offenseFormation
      })
    });

    const data = await res.json();
    // Extract filename without extension for display
    const filename = data.image.split('/').pop()?.replace('.png', '') || '';
    setImageName(filename);
    setImage(data.image);
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        NFL Play Generator
      </h1>

      <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-lg shadow">
        {/* Down Selection */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-3">Down</label>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((d) => (
              <label key={d} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="down"
                  value={d}
                  checked={down === d}
                  onChange={(e) => setDown(parseInt(e.target.value))}
                  className="w-4 h-4"
                />
                <span>{d}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Yards to Go */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Yards to Go: {ydstogo}
          </label>
          <select
            value={ydstogo}
            onChange={(e) => setYdstogo(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((distance) => (
              <option key={distance} value={distance}>
                {distance}
              </option>
            ))}
          </select>
        </div>

        {/* Yard Line */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Yard Line: {yardline100}
          </label>
          <select
            value={yardline100}
            onChange={(e) => setYardline100(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          >
            {[5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95].map((yardline) => (
              <option key={yardline} value={yardline}>
                {yardline}
              </option>
            ))}
          </select>
        </div>

        {/* Quarter Selection */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-3">Quarter</label>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((q) => (
              <label key={q} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="quarter"
                  value={q}
                  checked={quarter === q}
                  onChange={(e) => setQuarter(parseInt(e.target.value))}
                  className="w-4 h-4"
                />
                <span>Q{q}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Offense Formation */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Offense Formation
          </label>
          <select
            value={offenseFormation}
            onChange={(e) => setOffenseFormation(e.target.value)}
            className="w- ull p-2 border rounded"
          >
            <option>SHOTGUN</option>
            <option>UNDER_CENTER</option>
          </select>
        </div>

        <button
          onClick={getPlay}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700"
        >
          Generate Play
        </button>
      </div>

      {image && (
        <div className="mt-8 text-center">
          <h2 className="text-4xl font-bold mb-6">{imageName}</h2>
          <img src={image} className="mx-auto max-w-2xl" />
        </div>
      )}
    </main>
  );
}
