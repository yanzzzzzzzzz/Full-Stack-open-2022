import { StateContext } from './state';
import {  useContext } from "react";

export const useStateValue = () => useContext(StateContext);