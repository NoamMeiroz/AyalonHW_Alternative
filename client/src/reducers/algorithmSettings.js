import {
  SOLUTION_MARKS_LIST,
  SOLUTION_PROPERTIES_VALUES_LIST,
  SOLUTION_LIMITS_LIST,
} from "../actions/types";

const INITIAL_STATE = {
  solutionMarks: [],
  timestamp: new Date(),
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SOLUTION_MARKS_LIST:
      return {
        ...state,
        solutionMarks: action.solutionMarks,
        timestamp: new Date(),
      };
    case SOLUTION_PROPERTIES_VALUES_LIST:
      return {
        ...state,
        solutionPropertiesValues: action.solutionPropertiesValues,
        timestamp: new Date(),
      };
      case SOLUTION_LIMITS_LIST:
        return {
          ...state,
          solutionLimits: action.solutionLimits,
          timestamp: new Date(),
        };
    default:
      return state;
  }
}
