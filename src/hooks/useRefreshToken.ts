import axios from '../services/api/apiClient';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const authHook = useAuth();

    const refresh = async () => {
        //send refresh token with url as params , refresh token is saved in cookies
        const response = await axios.get('/auth/refresh');
        authHook?.setAuth((prev: any) => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return { ...prev, accessToken: response.data.accessToken }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;