import ShapeLayer from './ShapeLayer';

/**
 * create a map layer from a shape file
 * zipUrl is the name of the shape file passed as props. (as zip)
 * fieldsName is an object with features name to show in the popup. passed as props.    
 */
class LightTrainShapeLayer extends ShapeLayer {

    constructor(props) {
        super(props);
           this.style = this.style.bind(this);
    }

    getLightTrainColor = (feature) => {
		const colors = { "סגול": "purple", 
		"אדום": "red", 
		"ירוק": "green", 
		"כתום":"orange",
		"כחול": "blue",
		"צהוב": "yellow",
		"ירוק בהיר": "lightgreen",
	   "כחול בהיר": "lightblue",
	   "נופית": "maroon" };

		return colors[feature.properties.NAME];
	}

    style(feature) {
        return {
            opacity: 0.65,
            color: this.getLightTrainColor(feature),
        };
    };

  
}
export default LightTrainShapeLayer;
