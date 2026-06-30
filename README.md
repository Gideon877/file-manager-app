# File Explorer - Angular Client

A modern, responsive file explorer application built with Angular 22 and Angular Material. This is the frontend client for the File Manager API.

## 🚀 Features

- 📁 **Directory Navigation** - Browse files and folders with breadcrumb navigation
- 🔍 **Search** - Quickly find files and folders
- 📊 **File Statistics** - View file counts, folder counts, and total size
- 🎨 **Dual View Modes** - Switch between list and grid views
- 📄 **File Preview** - Preview images, PDFs, audio, video, and text files
- 📋 **Copy Path** - Copy current directory path to clipboard
- 🧭 **Go to Path** - Navigate directly to any directory path
- 📱 **Responsive** - Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Framework:** Angular 22
- **UI Library:** Angular Material
- **GraphQL Client:** Apollo Client
- **State Management:** Angular Signals
- **Styling:** SCSS with custom Material themes
- **Build Tool:** Angular CLI

## 📋 Prerequisites

- **Node.js:** v22.x or later (LTS recommended)
- **Yarn:** v1.22.x or later (or npm)
- **Angular CLI:** v22.x (installed globally)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Gideon877/file-manager-app.git
cd file-manager-app
```

### 2. Install Dependencies

Using Yarn (recommended):
```bash
yarn install
```

Using npm:
```bash
npm install
```

### 3. Start the Backend API

> **Important:** This frontend requires the backend API to be running.

Clone and start the backend:
```bash
git clone https://github.com/Gideon877/file-manager-api.git
cd file-manager-api
yarn install
BASE_DIRECTORY=/ yarn start:dev
```

The API will be available at `http://localhost:4006/graphql`

### 4. Start the Frontend

```bash
# Start the development server
yarn start
# or
npm start
```

Open your browser and navigate to `http://localhost:4200/`

## 🧪 Testing with Large Directories

To test the application's performance with 100,000+ files:

```bash
# Generate 100,000 test files
mkdir -p ~/test-files-100k && cd ~/test-files-100k
for i in $(seq 1 100000); do echo "File $i" > "file_$i.txt"; done

# Then in the app, navigate to: /Users/YOUR_USERNAME/test-files-100k
```

## 🔧 Configuration

### API Endpoint

The default API endpoint is `http://localhost:4006/graphql`. To change it, update `APOLLO_URI` in `src/app/app.config.ts`:

```typescript
const APOLLO_URI = 'http://localhost:4006/graphql';
```

## 📁 Project Structure

```
file-manager-app/
├── src/
│   ├── app/
│   │   ├── home/                  # Main file explorer component
│   │   │   ├── home.ts            # Component logic
│   │   │   ├── home.html          # Component template
│   │   │   ├── home.css           # Component styles
│   │   │   └── home.spec.ts       # Unit tests
│   │   ├── file-preview/          # File preview modal component
│   │   │   ├── file-preview.ts    # Component logic
│   │   │   ├── file-preview.html  # Component template
│   │   │   ├── file-preview.css   # Component styles
│   │   │   └── file-preview.module.ts
│   │   ├── models/                # TypeScript interfaces
│   │   │   └── file-system-entry.model.ts
│   │   ├── services/              # API services (Apollo Client)
│   │   │   └── file.service.ts
│   │   ├── material.module.ts     # Angular Material modules
│   │   ├── app.config.ts          # App configuration
│   │   ├── app.routes.ts          # Routing configuration
│   │   ├── app.ts                 # Root component
│   │   ├── app.html               # Root template
│   │   ├── app.css                # Root styles
│   │   └── app.spec.ts            # Root tests
│   ├── index.html                 # Entry HTML
│   ├── main.ts                    # Bootstrap entry point
│   ├── polyfills.ts               # Polyfills for browser support
│   └── styles.css                 # Global styles
├── angular.json                   # Angular CLI configuration
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.app.json              # TypeScript app configuration
├── tsconfig.spec.json             # TypeScript test configuration
├── yarn.lock                      # Yarn lockfile
├── public/
│   └── favicon.ico                # App favicon
└── README.md                      # Documentation
```


## 📊 Performance

- **100,000+ files:** Loads in 2-10 seconds
- **Memory usage:** Stable with streaming approach
- **UI responsiveness:** Fully responsive during loading
- **Search:** Instant filtering across all files

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature'
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

- **Author:** Gideon Thabang
- **GitHub:** [Gideon877](https://github.com/Gideon877)
- **Project Repository:** [file-manager-app](https://github.com/Gideon877/file-manager-app)

## 🙏 Acknowledgments

- [Angular](https://angular.dev/) - Framework
- [Angular Material](https://material.angular.io/) - UI Components
- [Apollo GraphQL](https://www.apollographql.com/) - GraphQL Client
- [NestJS](https://nestjs.com/) - Backend Framework


---