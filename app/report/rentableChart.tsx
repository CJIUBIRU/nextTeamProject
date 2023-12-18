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
import useCount from "./useCount";
import { CategoryScale, Chart, registerables } from "chart.js";
import {
  GridToolbarContainer,
  GridToolbarExport,
  zhTW,
} from "@mui/x-data-grid";
import html2pdf from "html2pdf.js";

Chart.register(CategoryScale);
Chart.register(...registerables);

export default function CountData() {
  const [counts] = useCount();
  const chartRef = useRef(null);

  // sort (small to large)
  const sortedCounts = counts.slice().sort((a, b) => a.count - b.count);

  // chart
  const chartData = {
    labels: sortedCounts.map((item) => item.name),
    datasets: [
      {
        label: "器材可借用數量",
        data: sortedCounts.map((item) => item.count),
        backgroundColor: "rgb(123, 196, 196)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: { title: { display: true, text: "器材名稱" } },
      y: { title: { display: true, text: "可借用數量" } },
    },
  };

  const handleExportToPDF = () => {
    const chartNode = chartRef.current;
    if (chartNode) {
      const pdfOptions = {
        margin: 10,
        filename: "count_data_chart.pdf",
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
            aria-labelledby="器材可借用數量"
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
                {"器材可借用數量"}
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
