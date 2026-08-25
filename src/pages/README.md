### /src/pages
- **`home/`** - Home page, its Projects and Articles sections, and integration test
- **`Temp.jsx`** - Sandbox page for experimenting with new features
- **`Trends.jsx`** - Bulk trends analysis article
- **`Prerendering.jsx`** - Prerendering for legacy SPAs article

### Home integration test
- Renders the Home child components
- Verifies the main heading and Projects, Articles, and Contact section order
- Confirms the footer is present
- Confirms navigation state scrolls to the requested section with smooth / start behavior
- Verifies the page title, description, and canonical URL