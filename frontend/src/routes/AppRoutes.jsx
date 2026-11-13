import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { ProtectedRoute, GuestRoute } from "./ProtectedRoute";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import BrowseListings from "../pages/BrowseListings";
import ListingDetails from "../pages/ListingDetails";
import CreateListing from "../pages/CreateListing";
import EditListing from "../pages/EditListing";
import MyListings from "../pages/MyListings";
import SavedListings from "../pages/SavedListings";
import Requests from "../pages/Requests";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
        <Route path="/listings" element={<ProtectedRoute><BrowseListings /></ProtectedRoute>} />
        <Route path="/listings/new" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
        <Route path="/listings/:id" element={<ProtectedRoute><ListingDetails /></ProtectedRoute>} />
        <Route path="/listings/:id/edit" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
        <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><SavedListings /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
