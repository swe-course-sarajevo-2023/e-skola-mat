import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { Box, CircularProgress } from "@mui/material";

const useProtectedRoute = (Component) => {
  const ProtectedComponent = (props) => {
    const [loading, setLoading] = useState(false);
    const [auth, setAuth] = useState(false);

    useEffect(() => {
      const verifyToken = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
          await axiosInstance.get("/auth/verify-token", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setLoading(false);
          setAuth(true)
          
        } catch (error) {
          setAuth(false)
          setLoading(false);
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      };

      verifyToken();
    }, []);

    if (loading)
      {
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
    }else{
      if (auth)
          return <Component {...props} />;
      
      return <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      Unauthorized!
    </Box>;
    }

    
  };

  return ProtectedComponent;
};

export default useProtectedRoute;
