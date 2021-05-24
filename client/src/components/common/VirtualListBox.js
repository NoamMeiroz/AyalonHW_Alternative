import React from "react";
import { List } from "react-virtualized";

const VirtualListBox = React.forwardRef(function VirtualListBox(
  props,
  ref
) {
  const { children, role, ...other } = props;
  const itemCount = Array.isArray(children) ? children.length : 0;
  const itemSize = 20;

  return (
    <div ref={ref}>
      <div {...other}>
        <List
          height={100}
          width={200}
          style={{direction:'rtl'}}
          rowHeight={itemSize}
          overscanCount={5}
          rowCount={itemCount}
          rowRenderer={props => {
            return React.cloneElement(children[props.index], {
              style: props.style
            });
          }}
          role={role}
        />
      </div>
    </div>
  );
});

export default VirtualListBox;