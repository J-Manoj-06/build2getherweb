# Uzhavu SEI Portal

A smart harvesting logistics platform connecting farmers and machinery owners for efficient resource sharing and harvest management.

## 🎯 Features

### For Farmers
- **Dashboard**: View crops, machinery, and bookings
- **Crop Management**: Add and track crops with AI-powered predictions
- **Machinery Booking**: Browse and book available machinery
- **Harvest Planning**: Get AI recommendations for optimal harvest times
- **Cluster Overview**: Connect with other farmers in your cluster
- **Profile Management**: Manage account and preferences

### For Machinery Owners
- **Dashboard**: Monitor machinery availability and demand
- **Booking Management**: Handle machinery rental requests
- **Availability Tracking**: Update machinery status and schedules
- **Earnings Dashboard**: Track revenue from machinery rentals
- **Profile Management**: Manage equipment inventory

### AI-Powered Features
- **Harvest Congestion Forecasting**: Predict machinery demand peaks
- **Yield Prediction**: Estimate crop yields based on conditions
- **Optimal Harvest Window**: AI recommendations for best harvest timing
- **Risk Analysis**: Weather, pest, and market volatility assessment
- **Machinery Demand Forecast**: Predict demand patterns

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (v20 recommended)
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd uzhavu-sei-portal

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Build for Production

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.jsx      # Main layout wrapper
│   └── ui/             # UI components
├── context/            # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   └── DataContext.jsx # Application data state
├── pages/              # Page components
│   ├── Auth/           # Login/Register pages
│   ├── Farmer/         # Farmer dashboard and pages
│   └── Buyer/          # Machinery owner pages
├── utils/              # Utility functions
│   ├── aiService.js   # AI prediction service
│   └── logicEngine.js # Business logic
├── App.jsx            # Main app component with routing
└── main.jsx           # Entry point

public/               # Static assets
dist/                 # Production build (generated)
```

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **Lucide React**: Icon library

## 🔐 Environment Variables

Create `.env` file in the project root:

```env
VITE_API_URL=https://api.example.com
VITE_APP_ENV=development
VITE_ENABLE_AI_PREDICTIONS=true
VITE_ENABLE_ANALYTICS=false
```

See `.env.example` for all available options.

## 🌐 Routing

### Public Routes
- `/login` - User login
- `/register` - User registration

### Protected Routes (Farmer)
- `/farmer/dashboard` - Main dashboard
- `/farmer/add-crop` - Add new crop
- `/farmer/add-machinery` - Add machinery rental
- `/farmer/cluster` - Cluster overview
- `/farmer/booking` - Machinery bookings
- `/farmer/my-crops` - Manage crops
- `/farmer/profile` - Profile settings

### Protected Routes (Machinery Owner)
- `/buyer/dashboard` - Main dashboard
- `/buyer/profile` - Profile settings

## 🛠️ Available Scripts

```bash
# Development
npm run dev        # Start dev server with HMR

# Build
npm run build      # Production build
npm run build:prod # Explicit production build

# Linting
npm run lint       # Run ESLint

# Preview
npm run preview    # Preview production build locally
```

## 📤 Deployment

### Deploy to Netlify

See [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**
```bash
npm run build
# Push to Git repository
# Connect repo to Netlify in dashboard
```

**Or use Netlify CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## 🔄 State Management

### Authentication Context
- User login/logout
- Role-based access (farmer/buyer)
- Token management

### Data Context
- Crop data
- Machinery data
- Booking information
- Cluster data

## 🧪 Testing

```bash
# Run tests (when configured)
npm test
```

## 📚 Tech Stack

- **React** 19.2.0 - UI library
- **Vite** 7.3.1 - Build tool
- **React Router** 7.13.0 - Client-side routing
- **Tailwind CSS** 3.4.17 - Styling
- **Capacitor** 8.1.0 - Mobile bridge (Android)
- **ESLint** 9.39.1 - Code linting

## 🐛 Debugging

### Browser DevTools
- Open DevTools (F12)
- Use React Developer Tools extension
- Monitor Network tab for API calls
- Check Console for errors

### Console Logging
The production build removes `console.log()` statements automatically via Terser minification.

For development, logs will appear in browser console.

## 📱 Mobile Support

The application is optimized for mobile devices:
- Responsive design with Tailwind CSS
- Touch-friendly UI
- Mobile-first approach
- Works with Capacitor for native Android wrapper

## 🔗 API Integration

### Expected API Structure

The app expects backend endpoints for:
- `/auth/login` - User authentication
- `/auth/register` - User registration
- `/crops` - Crop management
- `/machinery` - Machinery listings
- `/bookings` - Booking management
- `/clusters` - Cluster information

Update `VITE_API_URL` environment variable to point to your backend.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🙋 Support

For issues and questions:
1. Check [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) for deployment help
2. Review GitHub Issues
3. Contact development team

## 🎉 Getting Help

- **Deployment Issues**: See NETLIFY_DEPLOYMENT.md
- **Build Problems**: Run `npm run build` locally first
- **API Issues**: Verify backend endpoints in environment variables
- **Routing Issues**: Check React Router configuration in App.jsx

---

**Ready to deploy? See [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) for step-by-step instructions!** 🚀
