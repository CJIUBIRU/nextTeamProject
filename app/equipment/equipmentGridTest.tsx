import * as React from 'react';
import { ComponentRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import useEquipments from './useEquipment';
import { Equipment } from '../_settings/interfaces';
import { Box, Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, ChipProps, Chip, createTheme, ThemeProvider, Select, MenuItem, SelectChangeEvent, SelectProps, FormControl, InputLabel } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridFilterInputValueProps, GridFooter, GridFooterContainer, GridToolbarContainer, GridToolbarFilterButton, zhTW } from '@mui/x-data-grid';
import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';
import ConstructionIcon from '@mui/icons-material/Construction';

const initialFormState: Equipment & { mode: "add" | "edit" | "delete", originalName?: string; } = {
    mode: 'add',
    id: '',
    originalName: undefined,
    equipmentName: '',
    equipmentStatus: -1
};

// 1. 為了改成繁體中文用的
const theme = createTheme(
    {
        palette: {
            primary: { main: '#1976d2' },
        },
    },
    zhTW,
);
const statusOptions = [
    { value: '0', label: '租借中' },
    { value: '1', label: '可租借' },
    { value: '2', label: '維修中' },
];

// 由 MUI 負責 render，所以 props 是由 MUI 傳進來的（並非我們自己定義）
const EquipmentStatusSelect = (props: GridFilterInputValueProps) => {
    // 這邊的 item 其實就等於下面 `getApplyFilterFn` 裡面的 filterItem
    const { item: filterItem, applyValue, focusElementRef } = props

    // https://react.dev/learn/referencing-values-with-refs
    // https://pjchender.dev/react/react-doc-ref-and-dom/
    const selectRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(focusElementRef, () => ({
        focus: () => selectRef.current?.focus()
    }));

    // Like this
    // const [item, applyValue] = useState("")

    const handleChange: SelectProps['onChange'] = (e) => {
        applyValue({ ...filterItem, value: e.target.value })
    }

    const renderChip = (value: string) => {
        let chipIcon, chipLabel, chipColor;

        if (value === '0') {
            chipIcon = <WarningIcon />;
            chipLabel = '租借中';
            chipColor = 'error';
        } else if (value === '1') {
            chipIcon = <CheckIcon />;
            chipLabel = '可租借';
            chipColor = 'success';
        } else if (value === '2') {
            chipIcon = <ConstructionIcon />;
            chipLabel = '維修中';
            chipColor = 'primary';
        } else {
            chipIcon = <WarningIcon />;
            chipLabel = '系統錯誤';
            chipColor = 'error';
        }
        // 將 chipColor 轉換為 ChipProps 中的有效顏色
        const color: ChipProps['color'] = chipColor as ChipProps['color'];

        return (
            <Chip
                icon={chipIcon}
                label={chipLabel}
                variant="outlined"
                color={color}
            />
        );
    }
    // const renderChip = (value: number) => {
    //     let chipIcon, chipLabel, chipColor;

    //     if (value === 0) {
    //         chipIcon = <WarningIcon />;
    //         chipLabel = '租借中';
    //         chipColor = 'error';
    //     } else if (value === 1) {
    //         chipIcon = <CheckIcon />;
    //         chipLabel = '可租借';
    //         chipColor = 'success';
    //     } else if (value === 2) {
    //         chipIcon = <ConstructionIcon />;
    //         chipLabel = '維修中';
    //         chipColor = 'primary';
    //     } else {
    //         chipIcon = <WarningIcon />;
    //         chipLabel = '系統錯誤';
    //         chipColor = 'error';
    //     }
    //     const color: ChipProps['color'] = chipColor as ChipProps['color'];

    //     return (
    //         <Chip
    //             icon={chipIcon}
    //             label={chipLabel}
    //             variant="outlined"
    //             color={color}
    //         />
    //     );
    // };
    // uncontrolled: 預設值為 undefined/null 的 input
    // <input value={undefined} />
    // <input value={null} />

    return <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select
            label="Status"
            variant="outlined"
            name="equipmentStatus"
            ref={selectRef}
            // item.value 預設是 undefined
            // 當 item.value 是 undefined/null 時，將 value 改為空字串，避免 uncontrolled 錯誤
            value={filterItem.value ?? ''}
            onChange={handleChange}
        >
            {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {renderChip(option.value)}
                </MenuItem>
            ))}
        </Select>
    </FormControl>

}


const DataGridDemoTest: React.FC = () => {
    const [equipments, addEquipment, updateEquipment, deleteEquipment, isLoading] = useEquipments();
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [equipmentForm, setEquipmentForm] = useState(initialFormState)

    // 2. 因為我只要留篩選器(FILTER)所以客製化GridToolbar
    const CustomToolbar = () => (

        <GridToolbarContainer>
            <GridToolbarFilterButton />
        </GridToolbarContainer>
    );
    const CustomFooter = () => (
        <GridFooterContainer>
            <Button style={{marginLeft: "10px"}} variant="outlined" color="primary" onClick={handleAddDialogOpen}>新增器材</Button>
            <GridFooter sx={{
                border: 'none', // To delete double border.
            }} />
        </GridFooterContainer>
    );
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, value, valueAsNumber } = e.target;
        setEquipmentForm(prev => ({
            ...prev,
            [name]: type === 'number' ? valueAsNumber : value
        }))
    };

    const handleEdit = (id: string) => {
        const selectedEquipment = equipments.find(equipment => equipment.id === id);
        if (!selectedEquipment) return;

        setIsDialogOpen(true);
        setEquipmentForm({
            mode: 'edit',
            originalName: selectedEquipment.equipmentName,
            ...selectedEquipment
        })
    };

    const handleDelete = (id: string) => {
        const selectedEquipment = equipments.find(equipment => equipment.id === id);
        if (!selectedEquipment) return;

        setIsDialogOpen(true);
        setEquipmentForm({
            mode: 'delete',
            originalName: selectedEquipment.equipmentName,
            ...selectedEquipment
        })
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false)
    };
    const resetForm = () => setEquipmentForm(initialFormState)

    const handleAddDialogOpen = () => {
        setIsDialogOpen(true);
    };
    const handleEditEquipment = () => {
        updateEquipment({
            equipmentName: equipmentForm.equipmentName,
            id: equipmentForm.id,
            equipmentStatus: equipmentForm.equipmentStatus
        })
    };
    const handleDeleteEquipment = () => {
        deleteEquipment(equipmentForm.id)
    };
    const handleAddEquipment = () => {
        addEquipment({
            equipmentName: equipmentForm.equipmentName,
            equipmentStatus: equipmentForm.equipmentStatus
        })
    };
    const statusLabels: { [key: number]: string } = {
        0: '租借中',
        1: '可租借',
        2: '維修中',
    };
    const columns: GridColDef[] = [
        {
            field: 'displayId',
            headerName: '#',
            type: 'number',
            editable: false
        },
        {
            field: 'id',
            headerName: '器材編號',
            type: 'string',
            editable: false,
            width: 250
        },
        {
            field: 'equipmentName',
            headerName: '器材細項',
            type: 'string',
            width: 150,
            editable: false,
        },
        {
            field: 'equipmentStatus',
            headerName: '器材狀態',
            width: 150,
            editable: false,
            renderCell: (params) => {
                let chipIcon, chipLabel, chipColor;

                if (params.value === 0) {
                    chipIcon = <WarningIcon />;
                    chipLabel = '租借中';
                    chipColor = 'error';
                } else if (params.value === 1) {
                    chipIcon = <CheckIcon />;
                    chipLabel = '可租借';
                    chipColor = 'success';
                } else if (params.value === 2) {
                    chipIcon = <ConstructionIcon />;
                    chipLabel = '維修中';
                    chipColor = 'primary';
                } else {
                    chipIcon = <WarningIcon />;
                    chipLabel = '系統錯誤';
                    chipColor = 'error';
                }
                // 將 chipColor 轉換為 ChipProps 中的有效顏色
                const color: ChipProps['color'] = chipColor as ChipProps['color'];

                return (
                    <Chip
                        icon={chipIcon}
                        label={chipLabel}
                        variant="outlined"
                        color={color}
                    />
                );
            },
            filterOperators: [{
                // 給人看的
                label: '等於',
                value: 'is',
                // 每次選取條件就會被呼叫
                // filterItem: "條件"本身
                getApplyFilterFn: (filterItem) => {
                    if (!filterItem.field || !filterItem.value || !filterItem.operator) {
                        return null;
                    }
                    // 回傳給 MUI 檢驗用的函式
                    return (params: GridCellParams) => {
                        // params: 可以想成每個 row
                        // params = row + field = equipmentStatus => params.value 會是該 row 的 equpimentStatus 的值
                        return Number(params.value) === Number(filterItem.value);
                    };
                },
                InputComponent: EquipmentStatusSelect,
            }]
        },
        {
            field: 'action',
            headerName: '操作選項',
            width: 180,
            sortable: false,
            renderCell: (params) => {
                return (
                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" color="warning" size="small" onClick={
                            () => handleEdit(params.row.id)
                        }>編輯</Button>
                        <Button variant="outlined" color="error" size="small" onClick={
                            () => handleDelete(params.row.id)
                        }>刪除</Button>
                    </Stack>
                );
            },
        }
    ];

    return (
        <ThemeProvider theme={theme}>
            <DataGrid
                rows={equipments}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                slots={
                    {
                        toolbar: CustomToolbar,
                        footer: CustomFooter
                    }}

            />




            {/* <Dialog open={isDialogOpen} onClose={handleCloseDialog} aria-labelledby={`Edit/Delete/Add item`} onTransitionExited={resetForm}>
                <DialogTitle>{`${equipmentForm.mode === 'edit' ? '更新器材資訊: ' : equipmentForm.mode === 'delete' ? '刪除器材: ' : '新增器材'} ${equipmentForm.mode !== 'add' ? equipmentForm.originalName : ''}`}</DialogTitle>
                <DialogContent>
                    <TextField label="Equipment Name" variant="outlined" name="equipmentName" value={equipmentForm.equipmentName} onChange={handleInputChange} />
                    <TextField label="Status" variant="outlined" name="equipmentStatus" type='number' value={equipmentForm.equipmentStatus} onChange={handleInputChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">取消操作</Button>
                    {equipmentForm.mode === 'delete' ? (
                        <Button onClick={handleDeleteEquipment} color="secondary">確認刪除</Button>
                    ) : equipmentForm.mode === 'edit' ? (
                        <Button onClick={handleEditEquipment} color="primary">確認編輯</Button>
                    ) : (
                        <Button onClick={handleAddEquipment} color="primary">確認新增</Button>
                    )}
                </DialogActions>
            </Dialog> */}


            {/* <Dialog open={isDialogOpen} onClose={handleCloseDialog} aria-labelledby={`Edit/Delete/Add item`} onTransitionExited={resetForm}>
                <DialogTitle>{`${equipmentForm.mode === 'edit' ? '更新器材資訊： ' : equipmentForm.mode === 'delete' ? '刪除器材： ' : '新增器材'} ${equipmentForm.mode !== 'add' ? equipmentForm.originalName : ''}`}</DialogTitle>
                <DialogContent>
                    <TextField label="Equipment Name" variant="outlined" name="equipmentName" value={equipmentForm.equipmentName} onChange={handleInputChange} />
                    <Select
                        label="Status"
                        variant="outlined"
                        name="equipmentStatus"
                        value={equipmentForm.equipmentStatus === -1 ? '' : String(equipmentForm.equipmentStatus)}
                        onChange={(event: SelectChangeEvent<string>) => {
                            const selectedValue = event.target.value;
                            handleInputChange({
                                target: {
                                    name: 'equipmentStatus',
                                    type: 'string',
                                    value: selectedValue, // 將選定的值傳遞給 handleInputChange
                                }
                            } as React.ChangeEvent<HTMLInputElement>);
                        }}
                    >
                        {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">取消操作</Button>
                    {equipmentForm.mode === 'delete' ? (
                        <Button onClick={handleDeleteEquipment} color="secondary">確認刪除</Button>
                    ) : equipmentForm.mode === 'edit' ? (
                        <Button onClick={handleEditEquipment} color="primary">確認編輯</Button>
                    ) : (
                        <Button onClick={handleAddEquipment} color="primary">確認新增</Button>
                    )}
                </DialogActions>
            </Dialog> */}
            <Dialog open={isDialogOpen} onClose={handleCloseDialog} aria-labelledby={`Edit/Delete/Add item`} onTransitionExited={resetForm}>
                <DialogTitle>{`${equipmentForm.mode === 'edit' ? '更新器材資訊： ' : equipmentForm.mode === 'delete' ? '刪除器材： ' : '新增器材'} ${equipmentForm.mode !== 'add' ? equipmentForm.originalName : ''}`}</DialogTitle>
                <DialogContent>
                    <TextField style={{marginTop: "10px"}} label="器材細項" variant="outlined" name="equipmentName" value={equipmentForm.equipmentName} onChange={handleInputChange} />
                    <Select
                        label="Status"
                        variant="outlined"
                        name="equipmentStatus"
                        value={equipmentForm.equipmentStatus}
                        onChange={(event) => setEquipmentForm((prev) => ({ ...prev, equipmentStatus: Number(event.target.value) }))}
                        style={{marginTop: "10px"}}
                    >
                        {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">取消操作</Button>
                    {equipmentForm.mode === 'delete' ? (
                        <Button onClick={handleDeleteEquipment} color="secondary">確認刪除</Button>
                    ) : equipmentForm.mode === 'edit' ? (
                        <Button onClick={handleEditEquipment} color="primary">確認編輯</Button>
                    ) : (
                        <Button onClick={handleAddEquipment} color="primary">確認新增</Button>
                    )}
                </DialogActions>
            </Dialog>
        </ThemeProvider >
    );
};
export default DataGridDemoTest;

