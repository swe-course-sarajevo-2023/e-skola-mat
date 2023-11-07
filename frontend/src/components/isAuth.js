"use client";
import { useEffect, useContext } from "react";
import { redirect } from "next/navigation";
import AuthContext from "@/context/authContext";

export default function isAuth(Component) {
  return function IsAuth(props) {
    const { authenticated } = useContext(AuthContext);
    // console.log(authenticated);

    useEffect(() => {
      if (!authenticated) {
        alert("not authenticated!");
        return redirect("/");
      }
    }, []);

    if (!authenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
