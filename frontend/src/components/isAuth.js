"use client";
import { useEffect, useContext } from "react";
import { redirect } from "next/navigation";
import AuthContext from "@/context/authContext";
import { GetLoggedUser } from "@/api";
import { useQuery } from "react-query";

export default function isAuth(Component, route) {
  return function IsAuth(props) {
    const { authenticated, role } = useContext(AuthContext);
    //console.log(role);
    //console.log(authenticated);

    const { data } = useQuery(["getLoggedUser"], () => GetLoggedUser());

    const student_routes = ["student-view"];
    const professor_routes = [
      "homework-view",
      "professor-homework-view",
      "professor-group-view",
      "professor-homepage-view",
      "groups-homework-view",
      "group-student-view",
    ];
    const admin_routes = [
      "users-view",
      "homework-view",
      "professor-homework-view",
      "professor-group-view",
      "professor-homepage-view",
      "groups-homework-view",
      "group-student-view",
    ];

    useEffect(() => {
      if (!authenticated) {
        alert("not authenticated!");
        return redirect("/");
      } else {
        if (
          data?.user_role == "ADMINISTRATOR" &&
          role == "administrator" &&
          !admin_routes.includes(route)
        ) {
          alert("not authorised to see this page!");
          return redirect("/");
        } else if (
          data?.user_role == "PROFESSOR" &&
          role == "profesor" &&
          !professor_routes.includes(route)
        ) {
          alert("not authorised to see this page!");
          return redirect("/");
        } else if (
          data?.user_role == "STUDENT" &&
          role == "student" &&
          !student_routes.includes(route)
        ) {
          alert("not authorised to see this page!");
          return redirect("/");
        }
      }
    }, [data]);

    if (!authenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
