import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Badge from "@mui/material/Badge";

function Sites(props) {
  if (!props.sites) return null;
  const jsx = (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <List dense>
        {props.sites.map((site) => {
          return (
            <ListItem key={site.id}>
              <ListItemText
                primary={site.NAME}
                secondary={`${site.ADDRESS_STREET} ${site.ADDRESS_BUILDING_NUMBER}, ${site.ADDRESS_CITY}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="מספר עובדים">
                  <Badge
                    badgeContent={site.NUM_OF_EMPLOYEES}
                    max={99999}
                    color="primary"
                  >
                    <PeopleOutlineRoundedIcon />
                  </Badge>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
  return jsx;
}

export default Sites;
