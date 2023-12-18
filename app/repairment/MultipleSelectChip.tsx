import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import useRepairment from './useRepairment';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name: string, equipmentName: readonly string[], theme: Theme) {
    return {
        fontWeight:
            equipmentName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function MultipleSelectChip({
    equipment, setRepair, equipmentName, setEquipmentName, editVisible, editRepair
}: {
    equipment: string[];
    setRepair: (value: any) => void, equipmentName: string[],
    setEquipmentName: (value: string[]) => void,
    editVisible: boolean;
    editRepair: any;
}) {
    const theme = useTheme();

    React.useEffect(() => {
        if (editVisible) {
            setEquipmentName(editRepair.equipmentId);
        }
    }, [editVisible, editRepair.equipmentId, setEquipmentName]);
    // console.log(equipmentName);


    const [repairment, setRepairment] = useRepairment()
    // console.log("MultipleSelectChip", repairment);


    const names = equipment;


    const handleChange = (event: SelectChangeEvent<typeof equipmentName>) => {
        const {
            target: { value },
        } = event;
        const selectedEquipment = typeof value === 'string' ? value.split(',') : value;
        // console.log(selectedEquipment);

        setEquipmentName(selectedEquipment);
        setRepair((prevRepair: any) => ({ ...prevRepair, equipmentId: selectedEquipment }));
    };

    return (
        <div>
            <FormControl sx={{ marginTop: '10px', width: '100%' }}>
                <InputLabel id="demo-multiple-chip-label">器材編號</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={editVisible ? editRepair.equipmentId : equipmentName}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="器材編號" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                    disabled={editVisible}
                >
                    {names.map((name) => (
                        <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, equipmentName, theme)}
                        >
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}