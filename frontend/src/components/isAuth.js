"use client";
import { useEffect, useContext } from "react";
import { redirect } from "next/navigation";
import AuthContext from "@/context/authContext";

export default function isAuth(Component, route) {
  // console.log(route, "route");
  return function IsAuth(props) {
    const { authenticated, role } = useContext(AuthContext);
    // console.log(role, "role");
    // console.log(authenticated);
    const student_routes = ["student-view"];
    const professor_routes = [
      "homework-view",
      "professor-homework-view",
      "professor-group-view",
      "professor-homepage-view",
      "groups-homework-view",
    ];
    const admin_routes = [
      "users-view",
      "homework-view",
      "professor-homework-view",
      "professor-group-view",
      "professor-homepage-view",
      "groups-homework-view",
    ];

    useEffect(() => {
      if (!authenticated) {
        alert("not authenticated!");
        return redirect("/");
      } else {
        if (role == "admin" && !admin_routes.includes(route)) {
          alert("not authorised to see this page!");
          return redirect("/");
        } else if (role == "professor" && !professor_routes.includes(route)) {
          alert("not authorised to see this page!");
          return redirect("/");
        } else if (role == "student" && !student_routes.includes(route)) {
          alert("not authorised to see this page!");
          return redirect("/");
        }
      }
    }, []);

    if (!authenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
