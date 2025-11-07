# UI Components Documentation

## Overview

This document provides detailed information about the UI components used in the AI Career Coach application. The application uses a combination of custom components, Shadcn UI components, Radix UI primitives, and Aceternity UI components.

## Component Libraries

### Shadcn UI
Shadcn UI provides accessible and customizable components built on top of Radix UI primitives. Components include:
- Buttons
- Cards
- Dialogs
- Forms
- Navigation
- Tables

### Radix UI
Radix UI provides accessible, unstyled UI primitives that serve as the foundation for Shadcn UI components.

### Aceternity UI
Aceternity UI provides advanced animated components with beautiful visual effects.

### Custom Components
The application includes several custom components built specifically for career development features.

## Component Categories

## 1. Layout Components

### Header
The header component provides navigation and user authentication controls.

**Props:**
- `user`: User object for authentication state
- `isLoading`: Loading state indicator

**Features:**
- Responsive design
- Mobile navigation menu
- User profile dropdown
- Authentication controls

### Conditional Footer
The footer component that conditionally renders based on the current route.

**Props:**
- `pathname`: Current route path

**Features:**
- Hidden on authentication pages
- Hidden on 404 pages
- Responsive layout
- Social media links

### Hero
The hero component for the landing page.

**Props:**
- None

**Features:**
- Animated text effects
- Call-to-action buttons
- Background animations
- Responsive design

## 2. Form Components

### Input
Enhanced input field with validation support.

**Props:**
- All standard HTML input attributes
- `error`: Error message to display

**Features:**
- Built-in validation
- Error state styling
- Accessibility support
- Responsive design

### Textarea
Enhanced textarea with auto-resizing capabilities.

**Props:**
- All standard HTML textarea attributes
- `minHeight`: Minimum height of the textarea
- `maxHeight`: Maximum height of the textarea

**Features:**
- Auto-resizing based on content
- Character count display
- Accessibility support
- Responsive design

### Select
Custom select dropdown component.

**Props:**
- All standard HTML select attributes
- `options`: Array of option objects
- `placeholder`: Placeholder text

**Features:**
- Searchable options
- Grouped options
- Accessibility support
- Responsive design

### Radio Group
Custom radio group component for single selection.

**Props:**
- `options`: Array of option objects
- `value`: Current selected value
- `onChange`: Change handler function

**Features:**
- Horizontal and vertical layouts
- Custom styling
- Accessibility support
- Responsive design

### Checkbox
Custom checkbox component.

**Props:**
- All standard HTML checkbox attributes
- `label`: Label text for the checkbox

**Features:**
- Custom styling
- Accessibility support
- Responsive design

## 3. Data Display Components

### Card
Content container with header, body, and footer sections.

**Props:**
- `title`: Card title
- `description`: Card description
- `actions`: Action buttons
- `className`: Additional CSS classes

**Features:**
- Consistent styling
- Responsive design
- Header and footer sections
- Action button support

### Badge
Small status indicator component.

**Props:**
- `variant`: Style variant (default, success, warning, error)
- `children`: Badge content
- `className`: Additional CSS classes

**Features:**
- Multiple style variants
- Responsive design
- Accessibility support

### Progress
Visual progress indicator component.

**Props:**
- `value`: Current progress value (0-100)
- `max`: Maximum value
- `className`: Additional CSS classes

**Features:**
- Animated progress bar
- Percentage display
- Color-coded status
- Responsive design

### Alert
Notification component for displaying important messages.

**Props:**
- `variant`: Style variant (info, success, warning, error)
- `title`: Alert title
- `description`: Alert description
- `actions`: Action buttons
- `onClose`: Close handler function

**Features:**
- Dismissible alerts
- Multiple style variants
- Action button support
- Responsive design

## 4. Navigation Components

### Button
Custom button component with multiple variants.

**Props:**
- `variant`: Style variant (default, primary, secondary, ghost, outline)
- `size`: Button size (sm, md, lg)
- `loading`: Loading state
- `disabled`: Disabled state
- All standard HTML button attributes

**Features:**
- Multiple style variants
- Loading state support
- Icon support
- Responsive design

### Tabs
Tabbed interface component.

**Props:**
- `tabs`: Array of tab objects
- `activeTab`: Currently active tab
- `onTabChange`: Tab change handler

**Features:**
- Smooth transitions
- Keyboard navigation
- Accessibility support
- Responsive design

### Breadcrumb
Navigation breadcrumb component.

**Props:**
- `items`: Array of breadcrumb items
- `separator`: Custom separator character

**Features:**
- Automatic truncation
- Responsive design
- Accessibility support

### Pagination
Pagination component for navigating through data sets.

**Props:**
- `currentPage`: Current page number
- `totalPages`: Total number of pages
- `onPageChange`: Page change handler

**Features:**
- First/last page navigation
- Previous/next page navigation
- Jump to page
- Responsive design

## 5. Feedback Components

### Toast
Toast notification component for brief messages.

**Props:**
- `message`: Toast message
- `variant`: Style variant (info, success, warning, error)
- `duration`: Auto-dismiss duration
- `onDismiss`: Dismiss handler

**Features:**
- Auto-dismiss
- Manual dismiss
- Multiple style variants
- Queue management

### Modal
Modal dialog component for focused interactions.

**Props:**
- `isOpen`: Modal open state
- `onClose`: Close handler
- `title`: Modal title
- `description`: Modal description
- `actions`: Action buttons

**Features:**
- Keyboard navigation
- Focus trapping
- Accessibility support
- Responsive design

### Tooltip
Tooltip component for additional information.

**Props:**
- `content`: Tooltip content
- `position`: Tooltip position (top, right, bottom, left)
- `delay`: Show delay in milliseconds

**Features:**
- Multiple position options
- Customizable delay
- Accessibility support
- Responsive design

### Skeleton
Loading skeleton component for content placeholders.

**Props:**
- `className`: Additional CSS classes
- `width`: Skeleton width
- `height`: Skeleton height

**Features:**
- Smooth animation
- Customizable dimensions
- Responsive design

## 6. Data Visualization Components

### Chart
Chart component for data visualization using Recharts.

**Props:**
- `data`: Chart data
- `type`: Chart type (line, bar, pie, etc.)
- `options`: Chart configuration options

**Features:**
- Multiple chart types
- Responsive design
- Interactive tooltips
- Accessibility support

### Roadmap Visualizer
Interactive roadmap visualization component using React Flow.

**Props:**
- `nodes`: Array of roadmap nodes
- `connections`: Array of node connections
- `progress`: Progress tracking object
- `onStepToggle`: Step toggle handler

**Features:**
- Interactive nodes
- Visual connections
- Progress tracking
- Zoom and pan controls
- Mini-map overview

### Infinite Moving Cards
Animated card carousel component.

**Props:**
- `items`: Array of card items
- `direction`: Animation direction (left, right)
- `speed`: Animation speed
- `pauseOnHover`: Pause animation on hover

**Features:**
- Continuous animation
- Customizable speed
- Pause on hover
- Responsive design

## 7. Animation Components

### Text Generate Effect
Animated text component with character-by-character animation.

**Props:**
- `words`: Text to animate
- `className`: Additional CSS classes
- `filter`: Apply blur filter

**Features:**
- Character-by-character animation
- Customizable timing
- Blur effects
- Responsive design

### Spotlight
Spotlight effect component for highlighting content.

**Props:**
- `className`: Additional CSS classes
- `fill`: Spotlight color

**Features:**
- Dynamic positioning
- Customizable color
- Smooth animation

### Evervault Card
Animated card component with encrypted effect.

**Props:**
- `text`: Card text content
- `className`: Additional CSS classes

**Features:**
- Encrypted text effect
- Interactive animations
- Responsive design

## 8. Career-Specific Components

### Roadmap Steps
Component for displaying roadmap steps in a list format.

**Props:**
- `steps`: Array of roadmap steps
- `progress`: Progress tracking object
- `onStepToggle`: Step toggle handler

**Features:**
- Step-by-step display
- Progress indicators
- Interactive toggles
- Responsive design

### Quiz List
Component for displaying interview quizzes.

**Props:**
- `quizzes`: Array of quiz objects
- `onDelete`: Delete handler
- `onView`: View handler

**Features:**
- Quiz cards with scores
- Delete functionality
- Responsive design

### Quiz Component
Interactive quiz component for taking assessments.

**Props:**
- `questions`: Array of quiz questions
- `onSubmit`: Submit handler
- `onAnswer`: Answer handler

**Features:**
- Question navigation
- Answer validation
- Progress tracking
- Responsive design

### Quiz Result
Component for displaying quiz results.

**Props:**
- `score`: Quiz score
- `questions`: Array of questions with answers
- `improvementTip`: AI-generated improvement tip

**Features:**
- Score visualization
- Question review
- Improvement suggestions
- Export functionality

### Performance Chart
Component for displaying interview performance trends.

**Props:**
- `data`: Performance data
- `title`: Chart title

**Features:**
- Line chart visualization
- Score trends
- Responsive design

## 9. Utility Components

### Theme Provider
Component for managing application theme (light/dark mode).

**Props:**
- `children`: Child components
- `defaultTheme`: Default theme
- `enableSystem`: Enable system theme detection

**Features:**
- Light/dark mode support
- System theme detection
- Theme persistence
- Smooth transitions

### Conditional Wrapper
Component for conditionally wrapping children with another component.

**Props:**
- `condition`: Condition to check
- `wrapper`: Wrapper component
- `children`: Child components

**Features:**
- Conditional rendering
- Flexible wrapper options
- Performance optimized

## Component Usage Guidelines

### Accessibility
All components follow accessibility best practices:
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

### Performance
Components are optimized for performance:
- Lazy loading where appropriate
- Efficient re-rendering
- Minimal DOM footprint
- Bundle size optimization

### Styling
Components use Tailwind CSS for styling:
- Consistent design system
- Responsive breakpoints
- Customizable themes
- Utility-first approach

### Testing
Components are tested for:
- Functionality
- Accessibility
- Performance
- Cross-browser compatibility

## Customization

### Theme Variables
Components can be customized using CSS variables:
```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
}
```

### Component Props
Most components support extensive customization through props:
- Style variants
- Size options
- Behavior controls
- Event handlers

## Integration Examples

### Using a Button Component
```jsx
import { Button } from "@/components/ui/button";

function MyComponent() {
  return (
    <Button variant="primary" size="lg" onClick={() => console.log("Clicked!")}>
      Click Me
    </Button>
  );
}
```

### Using a Card Component
```jsx
import { Card } from "@/components/ui/card";

function MyComponent() {
  return (
    <Card title="My Card" description="This is a sample card">
      <p>Card content goes here</p>
    </Card>
  );
}
```

### Using the Roadmap Visualizer
```jsx
import RoadmapVisualizer from "@/app/(main)/roadmap/_components/roadmap-visualizer";

function MyComponent() {
  const nodes = [
    { id: "1", title: "Step 1", description: "Description 1" },
    { id: "2", title: "Step 2", description: "Description 2" }
  ];
  
  const connections = [
    { from: "1", to: "2" }
  ];
  
  const progress = { "1": true, "2": false };
  
  return (
    <RoadmapVisualizer 
      nodes={nodes}
      connections={connections}
      progress={progress}
      onStepToggle={(id) => console.log(`Toggled step ${id}`)}
    />
  );
}
```

## Best Practices

### Component Design
1. Keep components small and focused
2. Use composition over inheritance
3. Prefer props over state when possible
4. Follow accessibility guidelines
5. Optimize for performance

### Component Usage
1. Import only what you need
2. Use meaningful prop names
3. Provide fallback content
4. Handle loading states
5. Test across devices

### Styling
1. Use Tailwind utility classes
2. Maintain consistent spacing
3. Follow the design system
4. Consider dark mode
5. Test responsive behavior

## Troubleshooting

### Common Issues
1. **Component not rendering**: Check if all required props are provided
2. **Styling issues**: Verify Tailwind classes are correctly applied
3. **Performance problems**: Check for unnecessary re-renders
4. **Accessibility errors**: Validate ARIA attributes and keyboard navigation

### Debugging Tips
1. Use React DevTools to inspect component tree
2. Check browser console for errors
3. Verify component props in Storybook
4. Test with accessibility tools