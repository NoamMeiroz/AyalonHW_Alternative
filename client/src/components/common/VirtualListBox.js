import React from "react";
import { VariableSizeList as List } from "react-window";
import Typography from "@mui/material/Typography";

function renderRow(props) {
  const { data, index, style } = props;
  const dataSet = data[index];
  return React.cloneElement(dataSet, {
    style: style,
  });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

const VirtualListBox = React.forwardRef(function VirtualListBox(props, ref) {
  const { children, ...other } = props;
  const itemCount = Array.isArray(children) ? children.length : 0;
  const itemSize = 20;
  const itemData = [];
  children.forEach((item) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <List
          height={100}
          width={200}
          style={{ direction: "rtl" }}
          rowHeight={itemSize}
          itemSize={(index) => 20}
          overscanCount={5}
          outerElementType={OuterElementType}
          itemCount={itemCount}
          itemData={itemData}
          ref={gridRef}
        >
          {renderRow}
        </List>
      </OuterElementContext.Provider>
    </div>
  );
});

export default VirtualListBox;

// import React from "react";
// import { VariableSizeList as List} from "react-window";

// const VirtualListBox = React.forwardRef(function VirtualListBox(
//   props,
//   ref
// ) {
//   const { children, role, ...other } = props;
//   const itemCount = Array.isArray(children) ? children.length : 0;
//   const itemSize = 20;

//   return (
//     <div ref={ref}>
//       <div {...other}>
//         <List
//           height={100}
//           width={200}
//           style={{direction:'rtl'}}
//           rowHeight={itemSize}
//           overscanCount={5}
//           rowCount={itemCount}
//           rowRenderer={props => {
//             return React.cloneElement(children[props.index], {
//               style: props.style
//             });
//           }}
//           role={role}
//         />
//       </div>
//     </div>
//   );
// });

// export default VirtualListBox;
