"use client";
import Image from "next/image";
import fen from ".././assets/fen.json";
import Board from ".././components/board";
import { useState, useRef } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-rose-100">
      <Board fen={fen.FEN} />
    </main>
  );
}
