import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { Box, CircularProgress } from "@mui/material";

const useProtectedRoute = (Component) => {
  const ProtectedComponent = (props) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const verifyToken = async () => {
        const token = localStorage.getItem("token");
        try {
          await axiosInstance.get("/auth/verify-token", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setLoading(false);
        } catch (error) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      };

      verifyToken();
    }, []);

    if (loading)
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress size={80} />
        </Box>
      );

    // Render the original component if the token is valid
    return <Component {...props} />;
  };

  return ProtectedComponent;
};

export default useProtectedRoute;
