"use client";

import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState("");

  async function getPlay() {
    const res = await fetch("/api/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        down: 3,
        distance: 8,
        quarter: 4
      })
    });

    const data = await res.json();
    setImage(data.image);
  }

  return (
    <main className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-6">
        NFL Play Generator
      </h1>

      <button
        onClick={getPlay}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Generate Play
      </button>

      {image && (
        <div className="mt-8">
          <img src={image} className="mx-auto" />
        </div>
      )}
    </main>
  );
}
