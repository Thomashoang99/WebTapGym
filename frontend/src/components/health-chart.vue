<template>
  <div class="chart-container">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);
import { formatDate } from "../utils/helper";

const props = defineProps({
  entries: { type: Array, required: true },
});

const canvasRef = ref(null);
let chartInstance = null;

// CSS var colors
const styles = getComputedStyle(document.documentElement);
const textColor = styles.getPropertyValue("--text-primary").trim() || "#f1faee";
const gridColor = '#303030';
const weightColor = "#8BE9FD";
const fatColor = "#50FA7B";

function buildData() {
  return {
    labels: props.entries.map((e) => formatDate(e.date)).reverse(),
    datasets: [
      {
        label: "Weight",
        data: props.entries.map((e) => e.weight).reverse(),
        borderColor: weightColor,
        backgroundColor: weightColor + "33",
        fill: false,
        tension: 0.1,
        pointRadius: 4,
        yAxisID: "y",
      },
      {
        label: "Body fat",
        data: props.entries.map((e) => e.bodyFat).reverse(),
        borderColor: fatColor,
        backgroundColor: fatColor + "33",
        fill: false,
        tension: 0.1,
        pointRadius: 4,
        yAxisID: "y1",
      },
    ],
  };
}

// Option B: compute dynamic axis ranges
function computeOptions() {
  const weights = props.entries.map((e) => e.weight);
  const bodyFats = props.entries.map((e) => e.bodyFat);

  const wMin = Math.floor(Math.max(0, Math.min(...weights) - 2) / 2) * 2;
  const wMax = Math.ceil((Math.max(...weights) + 2) / 2) * 2;
  const fMin = Math.floor(Math.max(0, Math.min(...bodyFats) - 1));
  const fMax = Math.ceil(Math.min(50, Math.max(...bodyFats) + 1));

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { 
        position: "top", color: textColor, font: { size: 16 }
      },
      tooltip: {
        titleFont: { size: 14 },
        bodyFont:  { size: 14 },
        titleColor: textColor,
        bodyColor:  textColor,
        callbacks: {
          title: (items) => `Date: ${items[0].label}`,
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: textColor,
          font: { size: 16 },
        },
        ticks: {
          color: textColor,
          font: { size: 14 },
        },
        grid: {
          display: true,
          color: gridColor,
          drawBorder: false
        }
      },
      y: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Weight (kg)",
          color: textColor,
          font: { size: 16 },
        },
        ticks: {
          color: textColor,
          font: { size: 14 },
        },
        grid: {
          display: true,
          color: gridColor,
          drawBorder: false
        },
        min: wMin,
        max: wMax,
      },
      y1: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Body fat (%)",
          color: textColor,
          font: { size: 16 },
        },
        ticks: {
          color: textColor,
          font: { size: 14 },
        }, 
        grid: {
          drawOnChartArea: false,
          display: false,
          color: gridColor,
          drawBorder: false
        },
        min: fMin,
        max: fMax,
      },
    },
  };
}

onMounted(() => {
  const ctx = canvasRef.value.getContext("2d");
  chartInstance = new Chart(ctx, {
    type: "line",
    data: buildData(),
    options: computeOptions(),
  });
});

watch(
  () => props.entries,
  () => {
    if (!chartInstance) return;
    chartInstance.data = buildData();
    chartInstance.options = computeOptions();
    chartInstance.update();
  },
  { deep: true }
);
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
