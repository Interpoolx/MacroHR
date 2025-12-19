import React, { useState, createContext, useContext, useEffect } from 'react';

export type Route =
  | 'dashboard'
  | 'people'
  | 'payslip'
  | 'attendance'
  | 'benefits'
  | 'performance'
  | 'personal'
  | 'job-reference'
  | 'documents'
  | 'settings'
  | 'support';

const ROUTE_PATHS: Record<Route, string> = {
  dashboard: '/dashboard',
  people: '/people',
  payslip: '/payslip',
  attendance: '/attendance',
  benefits: '/benefits',
  performance: '/performance',
  personal: '/personal',
  'job-reference': '/job-reference',
  documents: '/documents',
  settings: '/settings',
  support: '/support',
};

const PATH_ROUTES: Record<string, Route> = Object.entries(ROUTE_PATHS).reduce(
  (acc, [route, path]) => {
    acc[path] = route as Route;
    return acc;
  },
  {} as Record<string, Route>,
);

const getRouteFromPath = (path: string): Route => {
  const cleanPath = path.replace(/^\//, '');
  return PATH_ROUTES[`/${cleanPath}`] || 'dashboard';
};

interface RouterContextType {
  currentRoute: Route;
  navigate: (route: Route) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<Route>(() => {
    return getRouteFromPath(window.location.pathname);
  });

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    window.history.pushState(null, '', ROUTE_PATHS[route]);
  };

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const handlePopState = () => {
      const newRoute = getRouteFromPath(window.location.pathname);
      setCurrentRoute(newRoute);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <RouterContext.Provider value={{ currentRoute, navigate, goBack }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within RouterProvider');
  }
  return context;
};
