## src/components/ui
- **`CustomSlider.jsx`** - Slider for tempo, and other future controllers  
- **`HowItWorks.jsx`** - Consistent flowchart/description display  
- **`Navbar.jsx`** - Github/Linkedin buttons & hamburger menu

## `CustomSlider`
**Parameters:**
- `min` (number, required) 
- `max` (number, required) 
- `value` (number | string, required) - Current value of the slider
- `onChange` (Function, required) - Callback when slider value changes

**Used in:** `TempoSlider.jsx:42`

## `HowItWorks`
**Parameters:**
- `title` (string, optional) - Title heading for the section (default: "How it works")
- `description` (JSX, required) -
- `flowchart` (JSX, optional) - Flowchart to display (default: `<LazyFlowchart />`)

**Used in:** `Crayonbrain.jsx:81`