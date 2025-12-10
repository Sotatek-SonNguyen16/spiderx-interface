import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check for token in localStorage or sessionStorage
    const localToken = localStorage.getItem("auth_token");
    const sessionToken = sessionStorage.getItem("auth_token");
    
    if (!localToken && !sessionToken) {
      // Redirect to login if no token found
      router.push("/signin");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    // You could render a loading spinner here
    return null;
  }

  return <>{children}</>;
};
