import React from 'react'
import { useState } from "react"
import { Box, Grid, Card, Typography, createTheme, ThemeProvider, Button } from "@mui/material";import tableCategory from './tableCategory'
import { DataGrid, GridColDef, GridRowsProp, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, zhTW } from '@mui/x-data-grid'
import { Category } from '../_settings/interfaces'

interface EnhancedTableProps {}

const enhancedTable: React.FC<EnhancedTableProps> = () => {
  const [tablecategory] = tableCategory();
  const [isLoading] = useState(false);
  const columns: GridColDef[] = [
    {
      field: 'categoryName',
      headerName: '器材名稱',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'categoryQuantity',
      headerName: '器材數量',
      type: 'number',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'repairTotal',
      headerName: '維修數量',
      type: 'number',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'percent',
      headerName: '維修率',
      type: 'number',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      valueGetter: (params) => {
        const repairRate = (params.row.repairTotal / params.row.categoryQuantity) * 100;
        return repairRate || 0;
      },
      sortComparator: (v1, v2) => (v1 as number) - (v2 as number),
      renderCell: (params) => {
        const repairRate = (params.row.repairTotal / params.row.categoryQuantity) * 100;
        return `${repairRate.toFixed(0)}%`;
      },
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const theme = createTheme(
    {
      palette: {
        primary: { main: '#1976d2'}
      },
    },
    zhTW,
  )

  const rows: GridRowsProp = tablecategory.map((category: Category) => ({
    ...category,
  }));

  return (
    <Box sx={{ height: 400, width: '80%' }}>
      <ThemeProvider theme={theme}>
        <Grid>
          <Card aria-labelledby="器材總數量" variant="outlined" style={{ padding: '1.5rem' }}>
            <Typography variant="h5" component="div">
              {"器材維修概況"}
            </Typography>
          </Card>
        </Grid>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
            
          }}
          pageSizeOptions={[5, 10, 25]}
          slots={{ toolbar: CustomToolbar }}
        />
      </ThemeProvider>
    </Box>
  );
};

export default enhancedTable;
