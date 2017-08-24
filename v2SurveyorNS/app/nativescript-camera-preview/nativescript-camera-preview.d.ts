// Declarations. Equivalent of Header files. Allows the functions to be used outside the module.

/* Gets the max size of a picture that the camera can capture.
 */
export function getMaxSize();

/* Gets called when the app is pausing
 */
export function onPause();

/* Gets called when the app is resuming
*/
export function onResume();

/* Requests the permissions for the camera.
 * UNUSED
 */
export function requestPermissions();

/* Loads the current page and the placeholder view into the module
 */
export function onLoaded(args, idName);

/* Gets called when the Placeholder creatingView event occurs.
 * This is the bulk of the logic
 */
export function onCreatingView(callback: () => void, args);

/* When the button is pressed.
   UNUSED
 */
export function onTakeShot(args);
