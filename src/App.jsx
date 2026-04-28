import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CreateFormPage from './pages/CreateFormPage';
import SchoolsPage from './pages/SchoolsPage';
import DepartmentsPage from './pages/DepartmentsPage';
import FacultyPage from './pages/FacultyPage';
import CoursesPage from './pages/CoursesPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import FeedbackList from './pages/Feedback';
import CourseAssignPage from './pages/CourseAssignPage';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-form/:token" element={<CreateFormPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout><DashboardPage /></Layout>} path="/" />
            <Route element={<Layout><AnalyticsPage /></Layout>} path="/analytics" />
            <Route element={<Layout><FeedbackList /></Layout>} path="/feedbacks" />
            
            <Route element={<Layout><SchoolsPage /></Layout>} path="/schools" />
            <Route element={<Layout><DepartmentsPage /></Layout>} path="/departments" />
            <Route element={<Layout><FacultyPage /></Layout>} path="/faculty" />
            <Route element={<Layout><CoursesPage /></Layout>} path="/courses" />
            <Route element={<Layout><CourseAssignPage /></Layout>} path="/assignment" />
          </Route>
          
          {/* Fallback */}
          
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}
