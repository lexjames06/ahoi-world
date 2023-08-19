/**
 * #### Get Style
 * If given "name" exists as a declared css variable,
 * this will return the value associated with that variable
 * 
 * If no css variable found with the given "name",
 * the "name" will be returned unchanged
 * 
 * 
 * @param {string} name variable name for style
 * @returns {string} variable value found in :root styles or same name as requested
 */
export const getStyle = (name: string): string => {
  const variableStyle =  getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`);
  return variableStyle ? variableStyle : name;
}