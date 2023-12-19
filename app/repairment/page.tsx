'use client'
import React, { useRef, useState } from 'react';
import { Alert, AlertTitle, Box, Button, Card, CardActions, CardContent, CardMedia, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FilledTextFieldProps, FormControl, FormControlLabel, FormLabel, Grid, IconButton, Input, MenuItem, OutlinedTextFieldProps, Radio, RadioGroup, StandardTextFieldProps, TextField, TextFieldVariants, ThemeProvider, Typography, createTheme } from '@mui/material';
import { DataGrid, GridColDef, GridLocaleText, GridToolbar, GridToolbarContainer, GridToolbarFilterButton, zhTW } from '@mui/x-data-grid';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip'
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import app from "@/app/_firebase/Config"
import { FirebaseError } from 'firebase/app';
import Image from 'next/image'
import { Timestamp } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import shortUUID from "short-uuid";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { format } from "date-fns";
import MultipleSelectChip from './MultipleSelectChip';
import useCategory from './useCategory';
import useEquipment from './useEquipment';
import useRepairment from './useRepairment';
import { Repair } from "../_settings/interfaces";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EquipmentSelectChip from './EquipmentSelectChip';

const theme = createTheme(
    {
        palette: {
            primary: { main: '#1976d2' },
        },
    },
    zhTW,
);

export default function Repairment() {
    const storage = getStorage(app);
    const [
        repairment,
        setRepairment,
        isLoading,
        repairList,
        addRepair,
        isAddLoading,
        updateEquipment,
        updateCategory,
        updateRepair,
        editRepairList
    ] = useRepairment();
    const [fileInputKey, setFileInputKey] = useState<string>('fileInputKey');
    const [equipmentName, setEquipmentName] = useState<string[]>([]);

    //DatePicker
    const [newDate, setnewDate] = React.useState(new Date());
    const date = format(newDate, "M/d/yyyy");
    // const [time, setTime] = useState(`${format(newDate, "M/d/yyyy")} ${Timestamp.fromDate(new Date()).toDate().toTimeString().slice(0, 5)}`);

    const [repair, setRepair] = useState({
        repairmentId: shortUUID.generate(),
        equipmentId: [''],
        repairReason: "",
        repairPhoto: "next.svg",
        repairStatus: 0,
        equipmentCategory: '',
        submitTime: `${format(newDate, "M/d/yyyy")} ${Timestamp.fromDate(new Date()).toDate().toTimeString().slice(0, 5)}`,
        doneTime: "",
    });


    console.log("page", repair);

    // 器材報修單
    const [queryCategory, setQueryCategory] = useState("");
    const [message, setMessage] = useState<JSX.Element>(<Alert severity="info">請填寫上述欄位</Alert>);
    const [status, setStatus] = useState(false);
    const [file, setFile] = useState<File>();

    const [category] = useCategory();
    const [equipment] = useEquipment(queryCategory);

    const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        if (editVisible == true) {
            setEditRepair({ ...editRepair, [e.target.name]: e.target.value })
        }
        else {
            setRepair({ ...repair, [e.target.name]: e.target.value })
        }
        console.log(repair);
    }

    const handleChangeQueryCategory = function (e: React.ChangeEvent<HTMLInputElement>) {
        let queryText = e.target.value;
        setRepair({ ...repair, 'equipmentCategory': queryText })
        setQueryCategory(queryText);
    }

    const handleUpload = async function (e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files !== null) {
            setRepair({ ...repair, repairPhoto: e.target.files[0].name })
            setFile(e.target.files[0]);
        }
    }

    const handleSubmit = async function (e: React.MouseEvent<HTMLElement>) {
        if (repair.equipmentId[0] === '' || repair.repairReason === '' || repair.repairPhoto === 'next.svg' || repair.equipmentCategory === '') {
            setMessage(<Alert severity="error">請完成填寫上述所有欄位，再送出申請</Alert>);
        }
        else {
            if (file) {
                const imageRef = ref(storage, file.name);
                await uploadBytes(imageRef, file);

                const starsRef = ref(storage, file.name);
                const photoURL = await getDownloadURL(starsRef);
                setRepair((prevRepair) => ({ ...prevRepair, repairPhoto: photoURL }));

                // setStatus(true);
                addRepair({
                    ...repair,
                    repairPhoto: photoURL,
                });
                updateEquipment(repair.equipmentId)
                updateCategory(repair.equipmentId, repair.equipmentCategory)
                setMessage(<Alert severity="success">報修成功！</Alert>);

                // Reset data
                setRepair(prevRepair => ({
                    ...prevRepair,
                    repairmentId: shortUUID.generate(),
                    equipmentId: [''],
                    repairReason: "",
                    repairPhoto: "next.svg",
                    repairStatus: 0,
                    equipmentCategory: '',
                    submitTime: `${format(newDate, "M/d/yyyy")} ${Timestamp.fromDate(new Date()).toDate().toTimeString().slice(0, 5)}`,
                    doneTime: "",
                }));
                setEquipmentName([]);
                setQueryCategory('');
                setFileInputKey((prevKey) => prevKey === 'fileInputKey' ? 'fileInputKey2' : 'fileInputKey');
                setStatus(false);
            }
            else {
                setMessage(<Alert severity="error">報修失敗，請再重新填寫並上傳</Alert>);
            }
        }
    }

    // 報修紀錄
    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarFilterButton />
            </GridToolbarContainer>
        );
    }
    const [selectedRows, setSelectedRows] = React.useState([{}]);

    // view repair information
    let data = {
        id: '', //doc.id
        equipmentId: [''],
        repairReason: '',
        repairStatus: '', // 0: 報修中; 1: 完成修理
        repairPhoto: '',
        equipmentCategory: '',
        submitTime: '',
        doneTime: '',
    };
    const [viewVisible, setViewVisible] = React.useState(false);
    const [viewRepairment, setViewRepairment] = React.useState(data)
    const handleViewClick = (row: any) => {
        setViewVisible(true)
        setViewRepairment(row);
    };

    // Edit repair information
    const [editVisible, setEditVisible] = React.useState(false);
    const [editRepair, setEditRepair] = React.useState(data)
    const handleEditClick = (row: any) => {
        setEditVisible(true);
        setStatus(true);
        setEditRepair(row);
    };
    const handleEditSubmit = async function (e: React.MouseEvent<HTMLElement>) {
        try {
            if (file) {
                const imageRef = ref(storage, file.name);
                await uploadBytes(imageRef, file);

                const starsRef = ref(storage, file.name);
                const photoURL = await getDownloadURL(starsRef);
                setEditRepair((prevRepair) => ({ ...prevRepair, repairPhoto: photoURL }));
                editRepairList({
                    ...editRepair,
                    repairPhoto: photoURL,
                });
            }
            else {
                editRepairList({ ...editRepair });
            }
            updateEquipment(editRepair.equipmentId)
            updateCategory(editRepair.equipmentId, editRepair.equipmentCategory)
            setMessage(<Alert severity="success">更新成功！</Alert>);

            // Reset data
            setEditRepair(prevEditRepair => ({
                ...prevEditRepair,
                id: '', //doc.id
                equipmentId: [''],
                repairReason: '',
                repairStatus: '', // 0: 報修中; 1: 完成修理
                repairPhoto: '',
                equipmentCategory: '',
                submitTime: '',
                doneTime: ''
            }));
            setFileInputKey((prevKey) => prevKey === 'fileInputKey' ? 'fileInputKey2' : 'fileInputKey');
            setStatus(false);
            setEditVisible(false);
            setEquipmentName([]);
        }
        catch (error) {
            console.log(error);
            setMessage(<Alert severity="error">更新失敗，請再重新填寫並上傳</Alert>);
        }
    }
    function cancelUpdate() {
        setEditVisible(false);
        setStatus(false);
        setEquipmentName([])
        setEditRepair({ ...data, repairReason: '' });
    }

    // Delete repair information
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [deleteRepair, setDeleteRepair] = useState(data);
    const handleDeleteClick = (row: any) => {
        setEditVisible(false);
        setStatus(false);
        setDeleteVisible(true);
        setDeleteRepair(data)
        setEquipmentName([])
    };
    function deleteRepairList() {
        updateRepair(deleteRepair, updateRepairStatusVisible);
        setDeleteVisible(false);
    }

    // Update repairStatus
    const [updateRepairStatusVisible, setUpdateRepairStatusVisible] = useState(false);
    const [updateRepairStatus, setUpdateRepairStatus] = React.useState(data)
    const handleUpdateClick = (row: any) => {
        // updateRepair(row);
        setUpdateRepairStatusVisible(true);
        setUpdateRepairStatus(row);
    };
    function updateRepairStatusDone() {
        updateRepair(updateRepairStatus, updateRepairStatusVisible);
        setUpdateRepairStatusVisible(false);
    }

    // Close button
    const handleCloseClick = () => {
        setEditVisible(false);
        setViewVisible(false);
        setDeleteVisible(false);
        setUpdateRepairStatusVisible(false);
    };


    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '報修單編號',
            width: 230,
            renderCell: (params) => (
                <Chip label={params.row.id} variant="outlined" onClick={() => handleViewClick(params.row)} />
            ),
        },
        { field: 'equipmentCategory', headerName: '報修器材', width: 80 },
        // { field: 'equipmentId', headerName: '報修器材編號', width: 200 },
        { field: 'submitTime', headerName: '提交報修時間', width: 150 },
        { field: 'repairStatus', headerName: '報修狀態', width: 80 },
        {
            field: 'actions',
            headerName: '操作選項',
            width: 125,
            renderCell: (params) => (
                <div>
                    <Tooltip title="修改報修資料">
                        <IconButton onClick={() => handleEditClick(params.row)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    {params.row.repairStatus === '報修中'
                        ? <>
                            <Tooltip title="完成修理">
                                <IconButton onClick={() => handleUpdateClick(params.row)}>
                                    <CheckCircleIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="刪除報修資料">
                                <IconButton onClick={() => handleDeleteClick(params.row)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                        : <>
                            <Tooltip title="完成修理">
                                <IconButton disabled>
                                    <CheckCircleIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="刪除報修資料">
                                <IconButton disabled>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    }
                </div>
            ),
        },
    ];
    const rows = repairList;

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Grid container rowSpacing={1} columns={16}>
                {/* {editVisible ? "編輯器材報修單" : "器材報修單"} */}

                <Grid xs={5}>
                    <Card aria-labelledby="器材報修單" variant='outlined' style={{ padding: '1.5rem', margin: '50px 25px 50px 50px' }}>
                        <Typography variant="h6" component="div">
                            {editVisible ? "編輯器材報修單" : "器材報修單"}
                        </Typography>
                        <CardContent>
                            <div>
                                {editVisible ?
                                    <TextField label="報修編號" variant="outlined" style={{ width: '100%', marginBottom: '10px' }}
                                        name="repairmnetId" defaultValue={editRepair.id} />
                                    : <TextField label="報修編號" variant="outlined" style={{ width: '100%', marginBottom: '10px' }}
                                        name="repairmnetId" defaultValue={repair.repairmentId} />
                                }
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="提交日期(readonly)"
                                        readOnly
                                        value={date}
                                        onChange={() => setnewDate(newDate)}
                                        renderInput={(params: React.JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, "variant">) => <TextField {...params} />}
                                    />
                                    <input type="hidden" name="submitTime"
                                        value={`${format(newDate, "M/d/yyyy")} ${Timestamp.fromDate(new Date()).toDate().toTimeString().slice(0, 5)}`}
                                        onChange={handleChange} />
                                </LocalizationProvider>
                                <TextField
                                    type="text"
                                    name="queryCategory"
                                    select style={{ width: '100%', marginRight: '20px' }}
                                    value={editVisible ? editRepair.equipmentCategory : queryCategory}
                                    label="器材種類"
                                    onChange={handleChangeQueryCategory}
                                    disabled={editVisible ? true : false}
                                >
                                    {category.map((item, key) =>
                                        <MenuItem value={item} key={key}>{item}</MenuItem>
                                    )}
                                </TextField>
                                <div>
                                    <MultipleSelectChip
                                        equipment={equipment}
                                        setRepair={setRepair}
                                        equipmentName={equipmentName}
                                        setEquipmentName={setEquipmentName}
                                        editVisible={editVisible}
                                        editRepair={editRepair}
                                    />
                                </div>
                                <TextField type="text" multiline name="repairReason" style={{ width: '100%', marginTop: '10px' }} value={editVisible ? editRepair.repairReason : repair.repairReason}
                                    label="器材報修原因" onChange={handleChange} />
                                <div>
                                    <p>請上傳報修照片：</p>
                                    <TextField key={fileInputKey} type="file" style={{ width: '100%', }} inputProps={{ accept: 'image/x-png,image/jpeg' }} onChange={handleUpload} />
                                </div>
                                {isAddLoading ? <CircularProgress /> : ''}
                                {status &&
                                    <Card sx={{ maxWidth: "30vw" }}>
                                        <CardMedia component="img" image={editVisible ? editRepair.repairPhoto : repair.repairPhoto} alt={editVisible ? editRepair.repairPhoto : repair.repairPhoto} />
                                    </Card>
                                }
                                {message}
                            </div>
                        </CardContent>
                        <CardActions style={{ float: 'right' }}>
                            {editVisible
                                ?
                                <>
                                    <Box marginRight={1}>
                                        <Button variant="outlined" color="primary" onClick={cancelUpdate}>取消更新</Button>
                                    </Box>
                                    <Button variant="contained" color="primary" onClick={handleEditSubmit}>更新器材報修單</Button>
                                </>
                                : <Button variant="contained" color="primary" onClick={handleSubmit}>送出器材報修單</Button>
                            }


                        </CardActions>
                    </Card>
                </Grid>
                <Grid xs={11} sx={{ px: '2rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: 'auto', width: 'auto', margin: '50px' }}>
                        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">報修紀錄</Typography>
                            <Alert severity="info">可點擊報修單編號查看詳情</Alert>
                        </Box>
                        {isLoading ? <CircularProgress /> :
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
                                    disableColumnMenu
                                />
                            </ThemeProvider>
                        }
                        {viewVisible ?
                            <Dialog open={viewVisible} onClose={handleCloseClick} aria-labelledby="瀏覽報修單紀錄">
                                <DialogTitle>瀏覽報修單紀錄</DialogTitle>
                                <DialogContent style={{ width: '450px', alignItems: 'center' }}>
                                    <br />
                                    <TextField label="報修單編號" variant="outlined" name="id" value={viewRepairment.id} /><p />
                                    <br />
                                    <TextField label="報修器材種類" variant="outlined" name="equipmentId" value={viewRepairment.equipmentCategory} /><p />
                                    <br />
                                    <EquipmentSelectChip viewRepairment={viewRepairment.equipmentId} equipment={equipment} />
                                    <TextField label="報修原因" variant="outlined" name="repairReason" value={viewRepairment.repairReason} /><p />
                                    <br />
                                    <TextField label="報修狀態" variant="outlined" name="repairmentStatus" value={viewRepairment.repairStatus} /><p />
                                    <br />
                                    <TextField label="提交報修時間" variant="outlined" name="repairmentStatus" value={viewRepairment.submitTime} /><p />
                                    <br />
                                    <TextField label="完成修理時間" variant="outlined" name="repairmentStatus"
                                        value={viewRepairment.doneTime === "" ? "還未完成修理" : viewRepairment.doneTime} /><p />
                                    <br />
                                    {/* sx={{ maxWidth: "30vw" }} */}
                                    <Card>
                                        <CardContent>
                                            <Typography sx={{ fontSize: 14 }} color="text.secondary" >報修照片</Typography>
                                            <CardMedia component="img" image={viewRepairment.repairPhoto} alt={viewRepairment.repairPhoto} />
                                        </CardContent>
                                    </Card>
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
                                </DialogActions>
                            </Dialog>
                            : " "
                        }
                        {updateRepairStatusVisible ?
                            <Dialog open={updateRepairStatusVisible} onClose={handleCloseClick} aria-labelledby="確認完成修理">
                                <DialogTitle>確認完成修理</DialogTitle>
                                <DialogContent>
                                    <Alert severity="warning">
                                        <AlertTitle>提醒您</AlertTitle>
                                        請確認該筆報修單之報修器材是否<strong>已確實完成修理</strong>？
                                    </Alert>
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
                                    <Button variant="outlined" color="error" onClick={handleCloseClick}>取消</Button>
                                    <Button variant="outlined" color="success" onClick={updateRepairStatusDone}>已確認</Button>
                                </DialogActions>
                            </Dialog>
                            : " "
                        }
                        {deleteVisible ?
                            <Dialog open={deleteVisible} onClose={handleCloseClick} aria-labelledby="確認刪除器材報修單">
                                <DialogTitle>確認刪除器材報修單</DialogTitle>
                                <DialogContent>
                                    <Alert severity="warning">
                                        <AlertTitle>提醒您</AlertTitle>
                                        請確認該筆器材報修單是否<strong>要刪除</strong>？
                                    </Alert>
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
                                    <Button variant="outlined" color="error" onClick={handleCloseClick}>取消</Button>
                                    <Button variant="outlined" color="success" onClick={deleteRepairList}>已確認</Button>
                                </DialogActions>
                            </Dialog>
                            : " "
                        }
                    </div>
                </Grid>
            </Grid>
        </Box >
    )
}