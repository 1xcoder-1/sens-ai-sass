# Directory Structure Documentation

## Overview

This document provides a comprehensive overview of the AI Career Coach application's directory structure, explaining the purpose and contents of each directory and file.

## Root Directory

```
ai-career-coach/
├── actions/
├── app/
├── components/
├── data/
├── docs/
├── hooks/
├── lib/
├── prisma/
├── public/
├── scripts/
├── .eslintrc.json
├── .gitignore
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── Dockerfile
├── README.md
├── SECURITY.md
├── components.json
├── contributing.md
├── database.md
├── deployment.md
├── docker-compose.yml
├── eslint.config.mjs
├── jsconfig.json
├── middleware.js
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── tailwind.config.mjs
```

## actions/

This directory contains server-side action handlers that encapsulate business logic and database operations.

**Key Files:**
- `resume.js` - Resume-related actions (create, improve, get)
- `cover-letter.js` - Cover letter actions (generate, save, delete)
- `interview.js` - Interview quiz actions (create, submit, delete)
- `roadmap.js` - Career roadmap actions (generate, save, update)
- `user.js` - User profile actions (get, update)
- `user-profile.js` - User onboarding actions
- `dashboard.js` - Dashboard data aggregation
- `chat.js` - Chat functionality (if implemented)

**Purpose:**
- Encapsulate server-side logic
- Provide reusable functions for API routes and components
- Handle database operations securely
- Implement business rules and validation

## app/

This directory contains the main Next.js application using the App Router structure.

```
app/
├── (auth)/
├── (main)/
├── api/
├── lib/
├── globals.css
├── layout.js
├── not-found.jsx
└── page.js
```

### (auth)/

Authentication routes that don't require user authentication.

**Structure:**
- `sign-in/[[...sign-in]]/page.jsx` - Sign-in page
- `sign-up/[[...sign-up]]/page.jsx` - Sign-up page
- `layout.js` - Authentication layout wrapper

### (main)/

Protected routes that require user authentication.

**Structure:**
```
(main)/
├── ai-cover-letter/
├── chat/
├── dashboard/
├── interview/
├── onboarding/
├── resume/
├── roadmap/
└── layout.jsx
```

#### ai-cover-letter/

Cover letter generation and management features.

**Key Files:**
- `page.jsx` - Main cover letter list page
- `new/page.jsx` - New cover letter creation page
- `[id]/page.jsx` - Individual cover letter view/edit page
- `_components/cover-letter-generator.jsx` - Cover letter generation component
- `_components/cover-letter-list.jsx` - Cover letter list component
- `_components/cover-letter-preview.jsx` - Cover letter preview component

#### chat/

Chat functionality (if implemented).

**Key Files:**
- `page.jsx` - Chat interface page

#### dashboard/

User dashboard with overview of all features.

**Key Files:**
- `page.jsx` - Main dashboard page
- `layout.js` - Dashboard layout
- `_component/dashboard-view.jsx` - Dashboard content component

#### interview/

Interview preparation and quiz management.

**Key Files:**
- `page.jsx` - Main interview page
- `mock/page.jsx` - Mock interview page
- `layout.js` - Interview layout
- `_components/performace-chart.jsx` - Performance visualization
- `_components/quiz-list.jsx` - Quiz list component
- `_components/quiz-result.jsx` - Quiz result display
- `_components/quiz.jsx` - Quiz taking interface
- `_components/stats-cards.jsx` - Statistics cards

#### onboarding/

User onboarding flow.

**Key Files:**
- `page.jsx` - Onboarding page
- `_components/onboarding-form.jsx` - Onboarding form component

#### resume/

Resume creation and improvement features.

**Key Files:**
- `page.jsx` - Resume editor page
- `_components/entry-form.jsx` - Resume entry form
- `_components/resume-builder.jsx` - Resume building interface

#### roadmap/

Career roadmap generation and visualization.

**Key Files:**
- `page.jsx` - Roadmap creation page
- `view/page.jsx` - Roadmap visualization page
- `_components/roadmap-steps.jsx` - Roadmap steps display
- `_components/roadmap-visualizer.jsx` - Interactive roadmap visualization

### api/

API route handlers for external integrations and webhooks.

**Key Files:**
- `cover-letter-test/route.js` - Cover letter testing endpoint
- `db-test/route.js` - Database testing endpoint
- `env-check/route.js` - Environment variable check
- `inngest/route.js` - Inngest webhook handler
- `test-db/route.js` - Database connection test
- `user-profile/route.js` - User profile API endpoint

### lib/

Application-specific utility functions and configurations.

**Key Files:**
- `helper.js` - Helper functions
- `schema.js` - Validation schemas

### Global Files

- `globals.css` - Global CSS styles
- `layout.js` - Root layout component
- `not-found.jsx` - 404 page
- `page.js` - Landing page

## components/

Reusable UI components used throughout the application.

```
components/
├── ui/
├── conditional-footer.jsx
├── header.jsx
├── hero.jsx
└── theme-provider.jsx
```

### ui/

Shadcn UI and Radix UI components.

**Key Files:**
- `accordion.jsx` - Accordion component
- `alert-dialog.jsx` - Alert dialog component
- `badge.jsx` - Badge component
- `button.jsx` - Button component
- `card.jsx` - Card component
- `dialog.jsx` - Dialog component
- `dropdown-menu.jsx` - Dropdown menu component
- `infinite-moving-cards.jsx` - Infinite moving cards component
- `input.jsx` - Input component
- `label.jsx` - Label component
- `progress.jsx` - Progress component
- `radio-group.jsx` - Radio group component
- `select.jsx` - Select component
- `sonner.jsx` - Toast notification component
- `tabs.jsx` - Tabs component
- `text-generate-effect.jsx` - Text animation component
- `textarea.jsx` - Textarea component

### Custom Components

- `conditional-footer.jsx` - Footer that conditionally renders
- `header.jsx` - Application header
- `hero.jsx` - Landing page hero section
- `theme-provider.jsx` - Theme management provider

## data/

Static data files used throughout the application.

**Key Files:**
- `faqs.js` - Frequently asked questions
- `features.js` - Feature descriptions
- `howItWorks.js` - How-it-works content
- `industries.js` - Industry data
- `testimonial.js` - User testimonials

## docs/

Documentation files for the project.

**Key Files:**
- `api.md` - API documentation
- `components.md` - UI components documentation
- `database.md` - Database schema documentation
- `deployment.md` - Deployment guide
- `directory-structure.md` - This file
- `features.md` - Features documentation
- `troubleshooting.md` - Troubleshooting guide

## hooks/

Custom React hooks for reusable logic.

**Key Files:**
- `use-fetch.js` - Data fetching hook

## lib/

Core utility functions and service clients.

```
lib/
├── inngest/
├── auth.js
├── checkUser.js
├── prisma.js
└── utils.js
```

### inngest/

Inngest-related utilities and function definitions.

**Key Files:**
- `client.js` - Inngest client configuration
- `function.js` - Inngest function definitions

### Core Utilities

- `auth.js` - Authentication utilities (`requireAuth`, `checkAuth`)
- `checkUser.js` - User validation utilities
- `prisma.js` - Prisma client initialization
- `utils.js` - General utility functions

## prisma/

Prisma ORM configuration and migration files.

```
prisma/
├── migrations/
└── schema.prisma
```

### migrations/

Database migration files generated by Prisma.

**Structure:**
- `YYYYMMDDHHMMSS_migration_name/` - Individual migration directories
  - `migration.sql` - SQL migration script
- `migration_lock.toml` - Migration lock file

### schema.prisma

Prisma schema definition file.

**Models:**
- `User` - User profiles and authentication
- `Assessment` - Interview practice sessions
- `Resume` - User resume content
- `CoverLetter` - Generated cover letters
- `Roadmap` - Career development roadmaps
- `IndustryInsight` - AI-generated industry data

## public/

Static assets served directly by the web server.

**Key Files:**
- `favicon.ico` - Website favicon
- `logo.png` - Application logo
- `banner.jpeg` - Landing page banner
- `robots.txt` - Search engine robots file
- `sitemap.xml` - Sitemap for search engines

## scripts/

Utility scripts for development and maintenance tasks.

**Key Files:**
- `clear-database.js` - Database clearing script
- `reset-database.js` - Database reset script
- `test-db-connection.js` - Database connection test
- `test-pg-connection.js` - PostgreSQL connection test

## Configuration Files

### .eslintrc.json

ESLint configuration for code linting.

### .gitignore

Git ignore patterns for version control.

### CHANGELOG.md

Project changelog documenting releases and changes.

### CODE_OF_CONDUCT.md

Community code of conduct guidelines.

### Dockerfile

Docker configuration for containerized deployment.

### README.md

Project README with setup and usage instructions.

### SECURITY.md

Security implementation documentation.

### components.json

Shadcn UI component configuration.

### contributing.md

Contributing guidelines for the project.

### database.md

Database schema documentation.

### deployment.md

Deployment guide and instructions.

### docker-compose.yml

Docker Compose configuration for multi-container deployments.

### eslint.config.mjs

ESLint configuration file.

### jsconfig.json

JavaScript project configuration.

### middleware.js

Next.js middleware for route protection.

### next.config.mjs

Next.js configuration file.

### package-lock.json

NPM dependency lock file.

### package.json

NPM package configuration.

### postcss.config.mjs

PostCSS configuration.

### tailwind.config.mjs

Tailwind CSS configuration.

## Best Practices

### File Naming Conventions

1. **Components**: Use PascalCase (`Button.jsx`, `UserProfile.jsx`)
2. **Pages**: Use kebab-case (`user-profile.jsx`, `cover-letter.jsx`)
3. **Utilities**: Use camelCase (`utils.js`, `helperFunctions.js`)
4. **Styles**: Use kebab-case (`globals.css`, `button-styles.css`)

### Directory Organization

1. **Feature-based grouping**: Group related files by feature
2. **Component subdirectories**: Use `_components` for feature-specific components
3. **API routes**: Place in `app/api` directory with descriptive names
4. **Server actions**: Place in `actions` directory with clear naming

### Code Organization

1. **Separation of concerns**: Keep UI, logic, and data separate
2. **Reusability**: Create reusable components and utilities
3. **Consistency**: Follow established patterns throughout the codebase
4. **Documentation**: Document complex logic and component APIs

## Development Workflow

### Adding New Features

1. **Create feature directory**: Add new directory under `app/(main)/`
2. **Implement pages**: Create page components for different views
3. **Add components**: Create reusable components in `_components` subdirectory
4. **Server actions**: Implement business logic in `actions/` directory
5. **API routes**: Add API endpoints if needed in `app/api/`
6. **Database schema**: Update Prisma schema if new models are needed
7. **Documentation**: Update relevant documentation files

### Making Changes

1. **Branch creation**: Create feature branch from main
2. **Implementation**: Make changes following established patterns
3. **Testing**: Test changes locally and in development environment
4. **Documentation**: Update documentation as needed
5. **Commit**: Make atomic commits with descriptive messages
6. **Pull request**: Create PR for review and discussion

## Troubleshooting

### Common Issues

1. **File not found errors**: Check directory structure and file paths
2. **Import errors**: Verify import paths and file extensions
3. **Component not rendering**: Check component exports and imports
4. **API route issues**: Verify route structure and file naming
