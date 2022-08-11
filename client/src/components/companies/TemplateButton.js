import React from 'react';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import CloudDownload from '@mui/icons-material/CloudDownload';

const templateLabelText = "קובץ קלט לדוגמה";

function TemplateBotton() {
    return <Link download href="/template.xlsx" underline="none">
        <Button variant="contained" component="span" size="small">
        <Box display="flex" alignItems="center" flexDirection="column">
            <CloudDownload style={{ fontSize: 20 }} />
            {templateLabelText}
        </Box>
    </Button>
</Link>
}

export default TemplateBotton;
