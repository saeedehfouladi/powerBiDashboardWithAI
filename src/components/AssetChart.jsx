"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const AssetChart = () => {
  const data = {
    labels: [
      "لپ تاپ",
      "تبلت",
      "ماشین های اداری",
      "نمایشگر",
      "ذخیره سازی",
      "کامپیوتر آماده",
      "لوازم جانبی",
      "تجهیزات شبکه",
    ],
    datasets: [
      {
        data: [25, 15, 18, 10, 12, 8, 7, 5],
        backgroundColor: [
          "#8B5CF6",
          "#F97316",
          "#22C55E",
          "#3B82F6",
          "#EC4899",
          "#F59E0B",
          "#06B6D4",
          "#EF4444",
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "70%",
  };

  const colors = [
    "#8B5CF6",
    "#F97316",
    "#22C55E",
    "#3B82F6",
    "#EC4899",
    "#F59E0B",
    "#06B6D4",
    "#EF4444",
  ];

  const items = [
    "لپ تاپ",
    "تبلت",
    "ماشین های اداری",
    "نمایشگر",
    "ذخیره سازی",
    "کامپیوتر آماده",
    "لوازم جانبی",
    "تجهیزات شبکه",
  ];

  const values = [25, 15, 18, 10, 12, 8, 7, 5];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mr-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-6 text-right">
        دارایی ها بر اساس گروه
      </h3>

      <div className="flex justify-center mb-6">
        <div className="w-48 h-48">
          <Doughnut data={data} options={options} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{item}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">
                {values[index]}%
              </span>
              <div
                className="w-10 h-1 rounded-full"
                style={{ backgroundColor: colors[index] }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetChart;
