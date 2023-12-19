"use client";
import { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
  zhTW,
} from "@mui/x-data-grid";
import {
  CircularProgress,
  Container,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import UseProduct from "./useHistory";
import { Product } from "../_settings/interfaces";

export default function Home() {
  const [products, addProduct, deleteProduct, updateProduct, isLoading] = UseProduct();
  // console.log(products);


  const [searchText, setSearchText] = useState("");

  // const rows = products.map((product) => ({
  //   id: product.id,
  //   userId: product.userId,
  //   userName: product.userName,
  //   equipmentCategory: product.equipmentCategory,
  //   equipmentQuantity: product.equipmentQuantity,
  //   period: product.period,
  //   date: product.date,
  //   rentTime: product.rentTime,
  //   returnTime: product.returnTime === "" ? "未歸還" : product.returnTime,
  // }));

  const rows = products;

  const columns: GridColDef[] = [
    // { field: "id", headerName: "userId" },
    { field: "userId", headerName: "教職員編號/學號", width: 180 },
    { field: "userName", headerName: "姓名", width: 150 },
    { field: "equipmentCategory", headerName: "器材種類", width: 130 },
    {
      field: "equipmentQuantity",
      headerName: "數量",
      type: "number",
      width: 70,
    },
    {
      field: "period",
      headerName: "時段",
      width: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "date",
      headerName: "登記日期",
      width: 160,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "rentTime",
      headerName: "登記時間",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "returnTime",
      headerName: "歸還時間",
      width: 130,
      headerAlign: "center",
      align: "center",
    },
  ];

  // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchText(event.target.value);
  // };

  // const filteredRows = rows
  // .filter((row) =>
  //   Object.values(row).some(
  //     (value) =>
  //       typeof value === "string" &&
  //       value.toLowerCase().includes(searchText.toLowerCase())
  //   )
  // )
  // .map((row) => ({
  //   ...row,
  //   id: row.userId.toString(),
  // }));


  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );

  const theme = createTheme(
    {
      palette: {
        primary: { main: '#1976d2' },
      },
    },
    zhTW,
  );

  return (
    <Container>
      <div style={{ height: 500, width: "100%", marginTop: "30px" }}>
        <ThemeProvider theme={theme}>
          <DataGrid
            rows={rows}
            columns={columns.map((column) => ({
              ...column,
              hide: column.field === "id", // 在這裡判斷是否隱藏 id 欄位
            }))}
            // checkboxSelection
            slots={{
              toolbar: CustomToolbar,
            }}
          />
        </ThemeProvider>
      </div>
    </Container>
  );
}
