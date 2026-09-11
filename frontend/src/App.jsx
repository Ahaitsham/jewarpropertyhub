import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import OwnerLayout from './layouts/OwnerLayout';

import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import ListYourProperty from './pages/ListYourProperty';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AdminPropertyForm from './pages/admin/AdminPropertyForm';
import AdminOwners from './pages/admin/AdminOwners';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminSubmissions from './pages/admin/AdminSubmissions';

import OwnerDashboard from './pages/owner/OwnerDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:slug" element={<PropertyDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/list-your-property" element={<ListYourProperty />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Route>

          {/* Unified login/signup — routes to /admin or /account based on role */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="properties/:id" element={<AdminPropertyForm />} />
            <Route path="owners" element={<AdminOwners />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="submissions" element={<AdminSubmissions />} />
          </Route>

          <Route path="/account" element={<OwnerLayout />}>
            <Route path="dashboard" element={<OwnerDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
