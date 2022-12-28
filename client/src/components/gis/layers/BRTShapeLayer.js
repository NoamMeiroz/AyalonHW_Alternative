import ShapeLayer from './ShapeLayer';

/**
 * create a map layer from a shape file
 * zipUrl is the name of the shape file passed as props. (as zip)
 * fieldsName is an object with features name to show in the popup. passed as props.    
 */
class BRTShapeLayer extends ShapeLayer {

    constructor(props) {
        super(props);
           this.style = this.style.bind(this);
    }

	getBRTColor = (feature) => {
		const colors = { "קו ורוד": "black", 
		"קו כחול": "blue", 
		"קו כתום": "orange", 
		"קו צהוב":"yellow",
		"קו חום": "brown",
 };

		return colors[feature.properties.NAME];
	}

    style(feature) {
        return {
            opacity: 0.65,
            color: this.getBRTColor(feature),
            dashArray: '3'
        };
    };

  
}
export default BRTShapeLayer;
