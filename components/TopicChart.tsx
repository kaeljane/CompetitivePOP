'use client'; // Gráficos precisam rodar no navegador (Client Side)

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useMemo } from 'react';

// Registrar os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TopicChart({ problems }: { problems: any[] }) {
  
  // Lógica para contar as tags
  const chartData = useMemo(() => {
    const tagCounts: Record<string, number> = {};

    problems.forEach(prob => {
      if (prob.tags && Array.isArray(prob.tags)) {
        prob.tags.forEach((tag: string) => {
          // Normaliza a tag (remove espaços extras)
          const cleanTag = tag.trim().toLowerCase();
          tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
        });
      }
    });

    // Ordenar para pegar as tags mais frequentes
    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1]) // Maior para menor
      .slice(0, 10); // Pegar top 10 para não poluir o gráfico

    const labels = sortedTags.map(item => item[0]);
    const data = sortedTags.map(item => item[1]);

    // Cores estilo "Codeforces" / Seu Design (Amarelo, Rosa, Roxo, Laranja...)
    const backgroundColors = [
      '#FFD700', // implementation (Gold)
      '#FF69B4', // dp (HotPink)
      '#9370DB', // math (MediumPurple)
      '#FF8C00', // greedy (DarkOrange)
      '#32CD32', // graphs (LimeGreen)
      '#1E90FF', // data structures (DodgerBlue)
      '#20B2AA', // strings (LightSeaGreen)
      '#F08080', // brute force (LightCoral)
      '#87CEEB', // geometry (SkyBlue)
      '#D3D3D3'  // outros (LightGray)
    ];

    return {
      labels,
      datasets: [
        {
          label: 'Questões por Tópico',
          data: data,
          backgroundColor: labels.map((_, i) => backgroundColors[i % backgroundColors.length]),
          borderRadius: 4,
        },
      ],
    };
  }, [problems]);

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permite ajustar altura pelo CSS
    plugins: {
      legend: { display: false }, // Esconder legenda para ficar limpo
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 } // Apenas números inteiros
      }
    }
  };

  if (problems.length === 0) {
    return <div style={{textAlign: 'center', marginTop: '40px', color: '#999'}}>Nenhuma questão cadastrada ainda.</div>;
  }

  return <Bar options={options} data={chartData} />;
}