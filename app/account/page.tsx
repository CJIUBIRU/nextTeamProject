'use client';
import * as React from 'react';
import { DataGrid, GridColDef, GridLocaleText, GridToolbar, GridToolbarContainer, GridToolbarFilterButton, zhTW } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, TextField, IconButton, Typography, MenuItem, Grid, FormControlLabel, FormLabel, FormControl, RadioGroup, Radio, DialogContentText, Alert, FilledTextFieldProps, OutlinedTextFieldProps, StandardTextFieldProps, TextFieldVariants, createTheme, ThemeProvider } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip'
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import useAccount from './useStudentAccount';
import { Account } from "../_settings/interfaces";
import StudentDataTable from './student';
import EmployeeDataTable from './employee';

export default function DataTable() {
    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Grid container rowSpacing={1}>
                <Grid xs={6}>
                    <StudentDataTable />
                </Grid>
                <Grid xs={6}>
                    <EmployeeDataTable />
                </Grid>
            </Grid>
        </Box >
    );
}