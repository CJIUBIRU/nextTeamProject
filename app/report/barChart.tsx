import React, { useRef } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import useCategory from "./useCategory";
import { CategoryScale, Chart, registerables } from "chart.js";
import html2pdf from "html2pdf.js";

Chart.register(CategoryScale);
Chart.register(...registerables);

export default function ChartData() {
  const [category] = useCategory();
  const chartRef = useRef(null);

  // sort (small to large)
  const sortedCategory = category
    .slice()
    .sort((a, b) => a.categoryQuantity - b.categoryQuantity);

  // Max & min
  const maxQuantity = Math.max(
    ...sortedCategory.map((item) => item.categoryQuantity)
  );
  const minQuantity = Math.min(
    ...sortedCategory.map((item) => item.categoryQuantity)
  );

  // chart
  const chartData = {
    labels: sortedCategory.map((item) => item.categoryName),
    datasets: [
      {
        label: "器材數量",
        data: sortedCategory.map((item) => item.categoryQuantity),
        backgroundColor: sortedCategory.map((item) =>
          item.categoryQuantity === maxQuantity
            ? "rgba(255, 99, 132, 0.6)"
            : item.categoryQuantity === minQuantity
            ? "rgba(54, 162, 235, 0.6)"
            : "rgb(123, 196, 196)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: { title: { display: true, text: "器材名稱" } },
      y: { title: { display: true, text: "器材數量" } },
    },
  };

  const handleExportToPDF = () => {
    const chartNode = chartRef.current;
    if (chartNode) {
      const pdfOptions = {
        margin: 10,
        filename: "chart.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf().from(chartNode).set(pdfOptions).save();
    }
  };

  return (
    <Box sx={{ width: "60%", bgcolor: "background.paper", overflow: "auto" }}>
      <Grid>
        <Card
          aria-labelledby="器材總數量"
          variant="outlined"
          style={{ padding: "1.5rem" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" component="div">
              {"器材總量"}
            </Typography>
            <Button variant="contained" onClick={handleExportToPDF}>
              匯出為 PDF
            </Button>
          </div>

          <CardContent>
            <div style={{ display: "grid" }} ref={chartRef}>
              <Bar style={{width: "85%", height: "85%"}} data={chartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
}
