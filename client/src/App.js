import React from "react";
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import Username from "./components/Username.js"
import PageNotFound from "./components/PageNotFound.js";
import Password from "./components/Password.js";
import Profile from "./components/Profile.js";
import Recovery from "./components/Recovery.js";
import Register from "./components/Register.js";
import Reset from "./components/Reset.js";

import { AuthoriseUser,ProtectRoute } from "./middleware/auth.js";

const App=()=>{
    const router=createBrowserRouter([
        {
            path:"/",
            element:<Username/>
        },
        {
            path:"/password",
            element:<ProtectRoute><Password/></ProtectRoute>
        },
        {
            path:"/profile",
            element:<AuthoriseUser><Profile/></AuthoriseUser>
        },
        {
            path:"/recovery",
            element:<Recovery/>
        },
        {
            path:"/Register",
            element:<Register/>
        },
        {
            path:"/reset",
            element:<Reset/>
        },
        {
            path:"*",
            element:<PageNotFound/>
        }
    ]);
    return(
        <>
           <RouterProvider router={router}></RouterProvider>
        </>
    )
}

export default App;