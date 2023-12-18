import React, { useRef } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  createTheme,
  ThemeProvider,
  Button,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import useCategory from "./useCategory";
import { CategoryScale, Chart, registerables } from "chart.js";
import {
  GridToolbarContainer,
  GridToolbarExport,
  zhTW,
} from "@mui/x-data-grid";
import html2pdf from "html2pdf.js";

Chart.register(CategoryScale);
Chart.register(...registerables);

export default function RentData() {
  const [category] = useCategory();
  const chartRef = useRef(null);

  // sort (small to large)
  const sortedCategory = category
    .slice()
    .sort((a, b) => a.rentAble - b.rentAble);

  // chart
  const chartData = {
    labels: sortedCategory.map((item) => item.categoryName),
    datasets: [
      {
        label: "器材可使用數量",
        data: sortedCategory.map((item) => item.rentAble),
        backgroundColor: sortedCategory.map((item) => {
          const threshold = item.categoryQuantity / 2;
          return item.rentAble < threshold
            ? "rgba(54, 162, 235, 0.6)"
            : "rgb(123, 196, 196)";
        }),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: { title: { display: true, text: "器材名稱" } },
      y: { title: { display: true, text: "器材可用數量" } },
    },
  };

  const handleExportToPDF = () => {
    const chartNode = chartRef.current;
    if (chartNode) {
      const pdfOptions = {
        margin: 10,
        filename: "rent_data_chart.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf().from(chartNode).set(pdfOptions).save();
    }
  };

  const theme = createTheme(
    {
      palette: {
        primary: { main: "#1976d2" },
      },
    },
    zhTW
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "60%", bgcolor: "background.paper" }}>
        <Grid>
          <Card
            aria-labelledby="器材可使用數量"
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
                {"器材可使用數量"}
              </Typography>
              <Button style={{backgroundColor: "#4f4f4f"}} variant="contained" onClick={handleExportToPDF}>
                匯出為 PDF
              </Button>
            </div>
            <CardContent>
              <div style={{ display: "grid" }} ref={chartRef}>
                <Bar style={{width: "75%", height: "75%"}} data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
