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
import useAccount from './useEmployeeAccount';
import { Account } from "../_settings/interfaces";

const theme = createTheme(
    {
        palette: {
            primary: { main: '#1976d2' },
        },
    },
    zhTW,
);

export default function EmployeeDataTable() {
    const [employeeAccount, addAccount, deleteAccount, updateAccount] = useAccount();
    // console.log(employeeAccount);

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarFilterButton />
            </GridToolbarContainer>
        );
    }
    const [selectedRows, setSelectedRows] = React.useState([{}]);

    // Edit account
    let data: Account = {
        docId: '',
        id: 0,
        name: '',
        level: 1
    };
    const [editVisible, setEditVisible] = React.useState(false);
    const [editAccount, setEditAccount] = React.useState(data)
    const handleEditClick = (row: any) => {
        setEditVisible(true)
        setEditAccount(row);
    };
    function update() {
        updateAccount(editAccount);
        setEditAccount(data);
        setEditVisible(false)
    }

    // Delete account
    const handleDeleteClick = () => {
        deleteAccount(selectedRows)
    };

    // Add account
    const [addVisible, setAddVisible] = React.useState(false);
    const [newAccount, setNewAccount] = React.useState({ id: 0, name: "", level: 1 });
    const handleAddClick = () => {
        setNewAccount({ ...newAccount });
        setAddVisible(true)
    };
    const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        if (addVisible == true)
            setNewAccount({ ...newAccount, [e.target.name]: e.target.value })
        else if (editVisible == true)
            setEditAccount({ ...editAccount, [e.target.name]: e.target.value })
    }
    function add() {
        addAccount(newAccount);
        setNewAccount({ id: 0, name: "", level: 1 })
        setAddVisible(false)
        // console.log(account);
    }
    const handleCloseClick = () => {
        setNewAccount({ id: 0, name: "", level: 1 });
        setEditAccount(data)
        setAddVisible(false)
        setEditVisible(false)
    };


    const columns: GridColDef[] = [
        { field: 'id', headerName: '教職員編號', width: 150 },
        { field: 'name', headerName: '教職員名字', width: 150 },
        {
            field: 'actions',
            headerName: '修改資料',
            width: 150,
            renderCell: (params) => (
                <Tooltip title="修改教職員資料">
                    <IconButton onClick={() => handleEditClick(params.row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];
    const rows = employeeAccount;
    // console.log(rows);


    return (
        <div style={{ height: 'auto', width: 'auto', margin: '50px' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">教職員名單</Typography>
                <div>
                    <Tooltip title="新增教職員">
                        <IconButton onClick={handleAddClick}>
                            <AddCircleIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="刪除教職員">
                        <IconButton onClick={handleDeleteClick}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </Box>

            <ThemeProvider theme={theme}>
                <DataGrid
                    slots={{ toolbar: CustomToolbar }}
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 15]}
                    checkboxSelection
                    onRowSelectionModelChange={(ids) => {
                        const selectedIDs = new Set(ids);
                        const selectedRows = rows.filter((row) =>
                            selectedIDs.has(row.id),
                        );

                        setSelectedRows(selectedRows);
                    }}
                    disableColumnMenu
                />
            </ThemeProvider>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <div>
                    <Tooltip title="提示說明">
                        <IconButton>
                            <ErrorOutlineIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <p>可批量選取後點選刪除</p>
            </Box>
            {/* <pre style={{ fontSize: 10 }}>
                            {JSON.stringify(selectedRows, null, 4)}
                        </pre> */}
            {addVisible ?
                <Dialog open={addVisible} onClose={handleCloseClick} aria-labelledby="新增教職員">
                    <DialogTitle>新增教職員</DialogTitle>
                    <DialogContent>
                        <TextField label="教職員編號" variant="outlined" name="id" value={newAccount.id} onChange={handleChange} /><p />
                        <br />
                        <TextField label="教職員名字" variant="outlined" name="name" value={newAccount.name} onChange={handleChange} /><p />
                    </DialogContent>
                    <DialogActions>
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseClick}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Button variant="contained" color="primary" onClick={add}>新增</Button>
                    </DialogActions>
                </Dialog>
                : " "
            }
            {editVisible ?
                <Dialog open={editVisible} onClose={handleCloseClick} aria-labelledby="修改教職員資料">
                    <DialogTitle>修改教職員資料</DialogTitle>
                    <DialogContent>
                        <TextField label="教職員編號" variant="outlined" name="id" value={editAccount.id} onChange={handleChange} /><p />
                        <br />
                        <TextField label="教職員名字" variant="outlined" name="name" value={editAccount.name} onChange={handleChange} /><p />
                    </DialogContent>
                    <DialogActions>
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseClick}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Button variant="contained" color="primary" onClick={update}>修改</Button>
                    </DialogActions>
                </Dialog>
                : " "
            }
        </div>
    );
}