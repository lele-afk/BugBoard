import { Button } from "@mui/material";
import React from "react";

const StyledButton = ({ label, onClick, sx, main = true, endIcon, children, ...props }) => {
    const color = main ? "#6750A4" : "#D61616"
    const handleClick = () => {
        if (onClick) {
            onClick()
        }

    }

    return <Button
        variant="contained"
        onClick={handleClick}
        sx={{
            backgroundColor: color,
            '&:hover': {
                backgroundColor: color,
                filter: 'brightness(0.9)',
            },
            ...sx
        }}
        endIcon={endIcon}
        {...props}
    >
        {label}
        {children}
    </Button>

}

export default StyledButton