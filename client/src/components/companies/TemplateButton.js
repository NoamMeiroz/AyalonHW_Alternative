import React from 'react';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import CloudDownload from '@material-ui/icons/CloudDownload';

const templateLabelText = "קובץ קלט לדוגמה";

function TemplateBotton() {
    return <Link className="actionButton" href="/template.xlsx" underline="none">
        <Button variant="contained" component="span" size="small">
            <Box display="flex" alignItems="center" flexDirection="column">
                <CloudDownload style={{ fontSize: 20 }} />
                {templateLabelText}
            </Box>
        </Button>
    </Link>
}

export default TemplateBotton;
