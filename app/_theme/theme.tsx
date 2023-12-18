import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        mode: 'light',
        // primary: {
        //     main: '#3f51b5',
        // },
        primary: {
            main: '#4F4F4F',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#fff',
        },
        secondary: {
            main: '#f50057',
        },
    },
});

export default theme;