# Frontend Migration & Improvement Tasks (shadcdn/ui)

## Completed Tasks
- [x] Remove Tailwind and custom CSS dependencies
- [x] Ensure all core features work with plain CSS

## In Progress Tasks
- [ ] Set up TailwindCSS and shadcdn/ui in the frontend project
- [ ] Refactor layout to use shadcdn/ui containers, cards, and grid components

## To Do

### 1. shadcdn/ui Setup
- [ ] Install TailwindCSS and configure it for the project
- [ ] Install shadcdn/ui and set up according to documentation
- [ ] Remove any remaining custom CSS that conflicts with Tailwind

### 2. Component Refactor
- [ ] Refactor the CSV upload form to use shadcdn/ui `Input`, `Button`, and `Card`
- [ ] Refactor test selection to use shadcdn/ui `Select` and `RadioGroup`
- [ ] Refactor results display to use shadcdn/ui `Card`, `Alert`, and `Badge`
- [ ] Refactor history list to use shadcdn/ui `Table` or `List` components
- [ ] Use shadcdn/ui `Dialog` or `Modal` for confirmation on delete

### 3. Graph Integration
- [ ] Ensure all graphs (bar, histogram, normal curve, p-value) are styled to match shadcdn/ui theme
- [ ] Add loading spinners (shadcdn/ui) while graphs/data are loading

### 4. User Experience
- [ ] Add shadcdn/ui `Alert` for error and success messages
- [ ] Add shadcdn/ui `Skeleton` or loading indicators for all async actions
- [ ] Ensure all forms and buttons are accessible and keyboard-navigable

### 5. Responsiveness & Polish
- [ ] Use shadcdn/ui grid and layout utilities for a responsive desktop layout
- [ ] Add tooltips or help text for test selection and confidence level
- [ ] Polish spacing, font sizes, and colors for a clean, modern look

### 6. Documentation
- [ ] Update README with new setup instructions for Tailwind and shadcdn/ui
- [ ] Document any new components or patterns used

## Relevant Files
- `/frontend/src/components/Upload.js` — CSV upload UI
- `/frontend/src/components/TestSelector.js` — Test/confidence selection UI
- `/frontend/src/components/Results.js` — Results and graphs display
- `/frontend/src/components/History.js` — Analysis history UI
- `/frontend/src/App.js` — Main app layout and routing

## Implementation Details
- Use only shadcdn/ui and Tailwind for all new UI
- Remove all legacy or custom CSS unless absolutely necessary
- Ensure all API integration remains functional 