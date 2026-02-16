"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [successProb, setSuccessProb] = useState(0);
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
    setSuccessProb(data.successProb || 0);
    setImageName(filename);
    setImage(data.image);
  }

  return (
    <main className="p-10 min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="flex items-center justify-between mb-8 gap-8">
        <img src="/Logo.png" alt="NFL Play AI Logo" className="h-16 w-32 flex-shrink-0" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex-1 text-center">
          NFL Play Generator
        </h1>
        <div className="flex-shrink-0">
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow">
        {/* Down Selection */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-3 text-gray-900 dark:text-white">Down</label>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((d) => (
              <label key={d} className="flex items-center gap-2 dark:text-white">
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
          <label className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Yards to Go: {ydstogo}
          </label>
          <select
            value={ydstogo}
            onChange={(e) => setYdstogo(parseInt(e.target.value))}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
          <label className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Yard Line: {yardline100}
          </label>
          <select
            value={yardline100}
            onChange={(e) => setYardline100(parseInt(e.target.value))}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
          <label className="block text-lg font-semibold mb-3 text-gray-900 dark:text-white">Quarter</label>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((q) => (
              <label key={q} className="flex items-center gap-2 dark:text-white">
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
          <label className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Offense Formation
          </label>
          <select
            value={offenseFormation}
            onChange={(e) => setOffenseFormation(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option>SHOTGUN</option>
            <option>UNDER CENTER</option>
          </select>
        </div>

        <button
          onClick={getPlay}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
        >
          Generate Play
        </button>
      </div>

        {image && (
    <div className="mt-8 text-center">
      <h2 className="text-4xl font-bold mb-6 dark:text-white">{imageName}</h2>
      <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6">
        Play Success Probability: {(successProb * 100).toFixed(2)}%
      </p>
      <img src={image} className="mx-auto max-w-2xl" />
    </div>
  )}
    </main>
  );
}
