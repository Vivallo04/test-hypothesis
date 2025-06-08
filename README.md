# Hypothesis Testing Web Application

A modern, responsive web application for statistical hypothesis testing with interactive visualizations.

---

## 🚀 Quick Start: Run with Docker Compose (No Technical Skills Needed)

**1. Install Docker Desktop:**
- Download and install Docker Desktop for your system: [Get Docker](https://www.docker.com/products/docker-desktop/)
- Open Docker Desktop and make sure it is running.

**2. Download the Project:**
- If you received a ZIP, extract it. If you have a folder, open it.

**3. Open a Terminal in the Project Folder:**
- On Windows: Right-click in the folder and choose "Open in Terminal" or "Open PowerShell window here".
- On Mac: Right-click and choose "New Terminal at Folder".

**4. Start the App:**
- Type this command and press Enter:
  ```bash
  docker-compose up --build
  ```
- The first time, this may take a few minutes as it downloads everything.

**5. Open the App in Your Browser:**
- Go to [http://localhost:3000](http://localhost:3000) for the web interface.
- The backend API runs at [http://localhost:8000](http://localhost:8000)

**6. Stop the App:**
- In the terminal, press `Ctrl+C` to stop.
- To free up resources, you can also run:
  ```bash
  docker-compose down
  ```

---

## 📄 Documentation & Resources

- [Frontend User Guide](../hypotest-frontend-docs.md)
- [Backend API Documentation](../hypotest-api-docs.md)
- [CSV Format Example](#csv-format-requirements)

---

## Features

### Core Functionality
- **CSV Upload**: Drag-and-drop or browse to upload CSV files with group and value columns
- **Test Selection**: Choose from multiple statistical tests:
  - T-Test (Independent & Paired)
  - ANOVA (One-way)
  - Chi-square
  - Mann-Whitney U
  - Wilcoxon
  - Kruskal-Wallis
- **Confidence Levels**: Select 90%, 95%, or 99% confidence levels
- **Results Display**: Comprehensive analysis results with statistical metrics
- **Interactive Charts**: Multiple visualization types using Chart.js
- **Analysis History**: View, rerun, and manage previous analyses

### Visualizations
- **Bar Charts**: Group means and medians comparison
- **Histograms**: Value distribution analysis
- **Normal Distribution Curves**: Fitted distribution overlays
- **P-Value Visualization**: Statistical significance representation

### Technical Features
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Error Handling**: Comprehensive validation and user feedback
- **Loading States**: Visual feedback during processing
- **API Integration**: RESTful endpoints for data processing

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Charts**: react-chartjs-2 with Chart.js
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd hypothesis-testing-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### CSV Format Requirements

Your CSV files must include:
- `group` column: Categorical grouping variable
- `value` column: Numeric values for analysis

Example CSV format:
\`\`\`csv
group,value
Control,23.5
Control,25.1
Treatment,28.3
Treatment,30.2
\`\`\`

## API Endpoints

The application expects the following backend endpoints:

- `POST /api/upload` - Upload CSV and run analysis
- `GET /api/history` - Retrieve analysis history
- `POST /api/rerun/{id}` - Rerun previous analysis
- `DELETE /api/delete/{id}` - Delete analysis record

## Project Structure

\`\`\`
├── app/
│   ├── api/           # API route handlers
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main application page
├── components/
│   ├── ui/            # shadcn/ui components
│   ├── analysis-charts.tsx
│   ├── csv-upload.tsx
│   ├── history-panel.tsx
│   ├── results-display.tsx
│   └── test-selection.tsx
└── lib/
    └── utils.ts       # Utility functions
\`\`\`

## Usage

1. **Upload Data**: Drag and drop or browse to select a CSV file
2. **Select Test**: Choose the appropriate statistical test for your data
3. **Set Confidence**: Select your desired confidence level
4. **Run Analysis**: Click "Run Analysis" to process your data
5. **View Results**: Examine statistical results and interactive charts
6. **Manage History**: Access previous analyses in the History tab

## Statistical Tests Supported

- **T-Test (Independent)**: Compare means between two independent groups
- **T-Test (Paired)**: Compare means between paired observations
- **ANOVA (One-way)**: Compare means across multiple groups
- **Chi-square**: Test independence between categorical variables
- **Mann-Whitney U**: Non-parametric test for two independent groups
- **Wilcoxon**: Non-parametric test for paired samples
- **Kruskal-Wallis**: Non-parametric alternative to one-way ANOVA

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
