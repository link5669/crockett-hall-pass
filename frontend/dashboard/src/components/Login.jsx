import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function Login({ setLoggedIn, email }) {
    return (
        <GoogleLogin
            onSuccess={credentialResponse => {
                const userObject = jwtDecode(credentialResponse.credential);
                const email = userObject.email;
                const regex = /^[^0-9].*htsdnj\.org$/;
                if (regex.test(email)) {
                    setLoggedIn(true)
                    localStorage.setItem('loggedIn','true')
                    //only for local use, do not change to ISO
                    localStorage.setItem('loginDate',Date.now())
                }
            }}
            onError={() => {
                console.log('Login Failed');
            }}
            scope="email profile"
        />
    )
}