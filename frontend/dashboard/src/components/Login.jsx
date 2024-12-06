import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { getBackendURL } from "../utilities";

export default function Login({ setLoggedIn, setEmail }) {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const userObject = jwtDecode(credentialResponse.credential);
        const email = userObject.email;
        const regex = /^[^0-9].*htsdnj\.org$/;
        if (regex.test(email)) {
          setLoggedIn(true);
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("loginDate", Date.now());
          localStorage.setItem("email", email);
          setEmail(email);
          axios.post(`${getBackendURL()}/api/addStaff?staffEmail=${email}`);
        }
      }}
      onError={() => {
        console.log("Login Failed");
      }}
      scope="email profile"
    />
  );
}
