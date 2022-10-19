import React, { useState } from "react";
import { useGridApiContext } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import { Tooltip } from "@mui/material";
import { isNumber } from "../../utils/numbersUtil";

export function isValidNumber(params, MAX, MIN) {
    let errorMessage = false;
    if (params.props.value === null || !isNumber(params.props.value))
      errorMessage = "הערך חייב להיות מספרי";
    else if (params.props.value > MAX || params.props.value < MIN)
      errorMessage = `הערך חייב להיות בטווח של ${MIN} עד ${MAX}`;
    return errorMessage;
  }

export function NumberCell(props) {
    const [originalValue, setOriginalValue] = useState(0);

    const { id, value, field, error } = props;
    const apiRef = useGridApiContext();

    const handleChange = (event) => {
        apiRef.current.setEditCellValue({ id, field, value: event.target.value });
        setOriginalValue(event.target.defaultValue);
    };

    return (
        <Tooltip open={!!error} title={error ?? ""}>
            <TextField
                name={`${field}EditCell`}
                precision={1}
                value={value ?? originalValue}
                onChange={handleChange}
                type="number" />
        </Tooltip>
    );
}
