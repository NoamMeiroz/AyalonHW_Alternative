import React from "react";
import { useMemo } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import RoomIcon from "@mui/icons-material/Room";
import DeleteIcon from "@mui/icons-material/Delete";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

// Classes used by Leaflet to position controls
const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};

/**
 * show origin and destination query filter control
 */
function DrawControl({
  position,
  startDrawClicked,
  destinationDrawClicked,
  deleteClicked,
}) {

  // Memoize the minimap so it's not affected by position changes
  const drawingMenu = useMemo(
    () => {

      /**
       * clear origin and destination polygon query filter
       */
      function deleteAllPolygon() {
        deleteClicked();
      }

      return <Box className="drawBox">
        <Tooltip title="מקור" placement="right">
          <IconButton
            onMouseDown={(e) => {
              startDrawClicked();
            }}
            onMouseUp={(e) => {
              startDrawClicked();
            }}
          >
            <RadioButtonUncheckedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="יעד" placement="right">
          <IconButton
            onMouseDown={(e) => {
              destinationDrawClicked();
            }}
            onMouseUp={(e) => {
              destinationDrawClicked();
            }}
          >
            <RoomIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="מחיקה">
          <IconButton
            onMouseDown={(e) => {
              deleteAllPolygon();
            }}
            onMouseUp={(e) => {
              deleteAllPolygon();
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;
  return (
    <div className={positionClass}>
      <div className="leaflet-control leaflet-bar">{drawingMenu}</div>
    </div>
  );
}

export default DrawControl;