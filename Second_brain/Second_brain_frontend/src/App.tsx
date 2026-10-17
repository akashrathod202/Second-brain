import { Routes, Route } from "react-router-dom";

import { DashboardLayout } from "./layouts/DashboardLayout";

import  Home  from "./pages/Home/Home";
import Library  from "../src/pages/Library/Library"
import Notes from "./pages/Notes/Notes"
import  Links  from "./pages/Links/Links";
import Videos from "./pages/Videos/Videos"
import  T  from "./pages/TEACK/PersonalSpace";
import { ProtectedRoute } from "./Components/auth/ProtectedRoute";
import Signin from "./pages/auth/SignIn";
import Signup from "./pages/auth/Signup";
import SecondBrainLanding from "./pages/SecondBrainLanding";
import  CreateContent  from "./pages/Create/CreateContent"
import Ask from "../src/pages/ASK/AskSecondBrain"
import ContentDetail from "./pages/Notes/ContentDetail";
 

function App() {
  return (
    <Routes>
  {/* Authentication routes */}
    <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}></Route>

      {/* Dashboard routes */}
      <Route path='/' element={<SecondBrainLanding/>}/>
      <Route element={<DashboardLayout />}>
        
        <Route path="/home" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/links" element={<Links />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/create" element={<CreateContent/>} />
        <Route path="/Ask" element={<Ask/>} />
        <Route path="/T" element={<T/>} />
        <Route
  path="/content/:contentId"
  element={<ContentDetail />}
/>
      </Route>

     
    </Routes>
  );
}

export default App;