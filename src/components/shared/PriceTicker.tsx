"use client";
import React from 'react';

export default function PriceTicker({ products }: { products: { emoji?: string; name: string; currentPrice: number; unit: string; changePercentage: number }[] }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-emerald-900 text-white py-2 overflow-hidden whitespace-nowrap relative shadow-inner">
      <div className="inline-block animate-marquee flex space-x-8 text-sm font-medium">
        {products.concat(products).map((item, idx) => {
          const isUp = item.changePercentage >= 0;
          return (
            <span key={idx} className="inline-flex items-center space-x-2 px-4 border-r border-emerald-700">
              <span>{item.emoji || "📦"}</span>
              <span>{item.name}</span>
              <span className="font-bold">৳{item.currentPrice} / {item.unit}</span>
              <span className={isUp ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                {isUp ? "▲" : "▼"} {Math.abs(item.changePercentage)}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}